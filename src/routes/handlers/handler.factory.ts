import ContextStore from '@app/core/context-store';
import BaseController from '@app/controllers/base.controller';
import HttpController from '@app/routes/handlers/http.handler';
import KafkaController from '@app/routes/handlers/kafka.handler';
import { injectable, inject } from 'inversify';
import components from '@app/components';
import { ErrorHandler } from '@app/errors/error-handler';
import AsyncStorageService from '@app/services/async-storage.service';

@injectable()
export class ControllerFactory {
  constructor(
    @inject(components.APP_CONTEXT_STORE) private appContextStore: ContextStore,
    @inject(components.ERROR_HANDLER) private errorHandler: ErrorHandler,
    @inject(components.ASYNC_STORAGE_SERVICE)
    private asyncStorage: AsyncStorageService,
  ) {}

  createHttpController(controller: BaseController<any>) {
    const httpController = new HttpController(
      controller,
      this.appContextStore,
      this.errorHandler,
      this.asyncStorage,
    );
    return httpController.exec.bind(httpController);
  }

  createKafkaController(controller: BaseController<any>) {
    const kafkaController = new KafkaController(
      controller,
      this.errorHandler,
      this.asyncStorage,
    );
    return kafkaController.exec.bind(kafkaController);
  }
}
