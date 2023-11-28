import BaseController from '@app/controllers/base.controller';
import { inject, injectable } from 'inversify';
import { logger } from '@app/core/logger';
import components from '@app/components';
import Config from '@app/config';
import NotFoundError from '@app/errors/not-found.error';
import { Request } from '@app/domains/app';

@injectable()
export class MetaController implements BaseController<any> {
  name = 'MetaController';

  constructor(@inject(components.CONFIG) private config: Config) {}

  async exec() {
    logger.info('fetching data %d!', 100);
    return {
      data: {
        service: this.config.service,
        instanceId: this.config.instance,
      },
    };
  }
}

@injectable()
export class HealthController implements BaseController<any> {
  name = 'HealthController';

  async exec() {
    return {
      data: 'ok',
    };
  }
}

@injectable()
export class ExampleKafkaController implements BaseController<any> {
  name = 'ExampleKafkaController';

  async exec(req: Request<void, void, void>) {
    logger.debugj(req);

    throw new NotFoundError({
      msg: 'kafka missing',
      context: {
        missing: 'yes',
      },
    });
  }
}
