import components from '@app/components';
import { ProcessEnv } from '@app/core/process-env';
import { injectable, inject, interfaces } from 'inversify';
import HttpServer from '@app/apps/http.app';

export interface App {
  start(): Promise<void>;
}

export enum APP_TYPE {
  server = 'server',
}

/**
 * appFactory method generates app of given type
 */
@injectable()
export class AppFactory {
  constructor(
    @inject(components.HTTP_FACTORY)
    private httpFactory: interfaces.Factory<HttpServer>,
    @inject(components.ENV) private processEnv: ProcessEnv,
  ) {}

  getApp(): App {
    switch (this.processEnv.appType) {
      case APP_TYPE.server:
        return this.httpFactory() as HttpServer;
      default:
        throw new Error('Invalid App Type');
    }
  }
}
