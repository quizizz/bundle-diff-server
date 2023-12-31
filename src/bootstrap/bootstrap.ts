import Config from '@app/config';
import { ErrorHandler } from '@app/errors/error-handler';
import { ENV } from '@app/types';
import SecretsManager from '@app/bootstrap/secrets-manager';
import { injectable, inject } from 'inversify';
import components from '@app/components';
import { ILogger } from '@app/core/logger';
import { ProcessEnv } from '@app/core/process-env';
import Resource from '@app/resources/resource';

@injectable()
export default class BootStrap {
  service: string;
  private resources: Resource[];

  constructor(
    @inject(components.ENV) private processEnv: ProcessEnv,
    @inject(components.ERROR_HANDLER) private errorHandler: ErrorHandler,
    @inject(components.CONFIG) private config: Config,
    @inject(components.LOGGER) private logger: ILogger,
  ) {
    this.service = this.processEnv.service;
    this.resources = [];
  }

  withResource(resource: Resource) {
    this.resources.push(resource);
    return this;
  }

  /**
   * load method first loads secrets into the environment, then generates a config and finally loads
   * all resources concurretly
   */
  async load() {
    const secretsManager = new SecretsManager(
      this.processEnv.env as ENV,
      this.service,
    );
    await secretsManager.loadSecrets();

    await this.config.load();

    this.logger.info(
      `Running ${this.config.env}/${this.config.componentType}/${this.config.apiver}#${this.config.runversion}`,
    );

    process.on('unhandledRejection', (ex: Error) =>
      this.errorHandler.handle(ex, {
        details: { unhandledRejection: true },
      }),
    );

    const results = await Promise.allSettled(
      this.resources.map((resource) => resource.load()),
    );

    results.map((result) => {
      if (result.status === 'rejected') {
        return this.errorHandler.handle(result.reason, {
          method: 'GET',
          route: 'loadResource',
        });
      }
    });

    return this.config;
  }
}
