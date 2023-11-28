import { Main } from '@app/apps';
import ContextStore from '@app/core/context-store';
import { Container, interfaces } from 'inversify';
import { logger, ILogger } from '@app/core/logger';
import components from '.';
import BootStrap from '@app/bootstrap/bootstrap';
import HttpServer from '@app/apps/http.app';
import { AppFactory } from '@app/apps/factory.app';
import { ControllerFactory } from '@app/routes/handlers/handler.factory';
import { HttpRoutes } from '@app/routes/http';
import { ErrorHandler, ErrorHandlerSentry } from '@app/errors/error-handler';
import Config from '@app/config';
import { KafkaRoutes } from '@app/routes/kafka';
import KafkaResource from '@app/resources/kafka-resource';
import ExampleResource from '@app/resources/example-resource';
import { ProcessEnv } from '@app/core/process-env';
import Emitter from '@app/core/emitter';
import { MetaController } from '@app/controllers';
import { NotFoundController } from '@app/controllers/404.controller';
import {
  ExampleKafkaController,
  HealthController,
} from '@app/controllers/meta.controller';
import AsyncStorageService from '@app/services/async-storage.service';
import KafkaWorker from '@app/apps/kafka.app';
import MathsController from '@app/controllers/maths.controller';
import MiddlewareFactory from '@app/middlewares/factory.middleware';

/**
 * Inits DI container
 */
function createDependencyContainer() {
  const container = new Container();

  /** -------------------------------- Core  -------------------------------- */
  container.bind<ProcessEnv>(components.ENV).to(ProcessEnv).inSingletonScope();
  container.bind<Config>(components.CONFIG).to(Config).inSingletonScope();
  container.bind<ILogger>(components.LOGGER).toConstantValue(logger);
  container
    .bind<ContextStore>(components.APP_CONTEXT_STORE)
    .to(ContextStore)
    .inSingletonScope();
  container
    .bind<BootStrap>(components.BOOTSTRAP)
    .to(BootStrap)
    .inSingletonScope();
  container
    .bind<ErrorHandler>(components.ERROR_HANDLER)
    .to(ErrorHandlerSentry)
    .inSingletonScope();
  container.bind<Emitter>(components.EMITTER).to(Emitter).inSingletonScope();

  /** -------------------------------- App -------------------------------- */

  container
    .bind<AppFactory>(components.APP_FACTORY)
    .to(AppFactory)
    .inSingletonScope();
  container.bind<HttpServer>(components.HTTP_SERVER).to(HttpServer);
  container
    .bind<interfaces.Factory<HttpServer>>(components.HTTP_FACTORY)
    .toAutoFactory<HttpServer>(components.HTTP_SERVER);
  container.bind<KafkaWorker>(components.KAFKA_WORKER).to(KafkaWorker);
  container
    .bind<interfaces.Factory<KafkaWorker>>(components.KAFKA_FACTORY)
    .toAutoFactory<KafkaWorker>(components.KAFKA_WORKER);

  /** -------------------------------- Routes -------------------------------- */
  container
    .bind<HttpRoutes>(components.HTTP_ROUTES)
    .to(HttpRoutes)
    .inSingletonScope();
  container
    .bind<KafkaRoutes>(components.KAFKA_ROUTES)
    .to(KafkaRoutes)
    .inSingletonScope();
  container
    .bind<MiddlewareFactory>(components.MIDDLEWARE_FACTORY)
    .to(MiddlewareFactory)
    .inSingletonScope();

  /** -------------------------------- Resources  -------------------------------- */

  container
    .bind<KafkaResource>(components.KAFKA)
    .to(KafkaResource)
    .inSingletonScope();
  container
    .bind<ExampleResource>(components.EXAMPLE)
    .to(ExampleResource)
    .inSingletonScope();

  /** -------------------------------- Controllers -------------------------------- */

  container
    .bind<ControllerFactory>(components.CONTROLLER_FACTORY)
    .to(ControllerFactory)
    .inSingletonScope();

  container
    .bind<MetaController>(components.META_CONTROLLER)
    .to(MetaController)
    .inSingletonScope();

  container
    .bind<ExampleKafkaController>(components.EXAMPLE_KAFKA_CONTROLLER)
    .to(ExampleKafkaController)
    .inSingletonScope();

  container
    .bind<HealthController>(components.HEALTH_CONTROLLER)
    .to(HealthController)
    .inSingletonScope();

  container
    .bind<NotFoundController>(components.NOT_FOUND_CONTROLLER)
    .to(NotFoundController)
    .inSingletonScope();

  container
    .bind<MathsController>(components.MATHS_CONTROLLER)
    .to(MathsController)
    .inSingletonScope();

  /** -------------------------------- Services -------------------------------- */
  container
    .bind<AsyncStorageService>(components.ASYNC_STORAGE_SERVICE)
    .to(AsyncStorageService)
    .inSingletonScope();

  /** -------------------------------- Main app -------------------------------- */
  container.bind<Main>(components.MAIN).to(Main).inSingletonScope();

  return () => {
    return container;
  };
}

export default createDependencyContainer();
