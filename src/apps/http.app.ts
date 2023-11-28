import type Config from '@app/config';
import { HttpRoutes } from '@app/routes/http';
import { injectable, inject } from 'inversify';
import BootStrap from '@app/bootstrap/bootstrap';
import ExampleResource from '@app/resources/example-resource';
import express, {
  Express,
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
  Router,
} from 'express';
import KafkaResource from '@app/resources/kafka-resource';
import { ILogger } from '@app/core/logger';
import components from '@app/components';
import { ErrorHandler } from '@app/errors/error-handler';
import { ErrorMessageGenerator } from '@app/routes/handlers/helpers';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

@injectable()
export default class HttpServer {
  app: Express;

  constructor(
    @inject(components.CONFIG) private config: Config,
    @inject(components.BOOTSTRAP) private bootstrap: BootStrap,
    @inject(components.HTTP_ROUTES) private httpRoutes: HttpRoutes,
    @inject(components.LOGGER) private logger: ILogger,
    @inject(components.ERROR_HANDLER) private errorHandler: ErrorHandler,

    // Resources
    @inject(components.EXAMPLE) private exampleResource: ExampleResource,
    @inject(components.KAFKA) private kafkaResource: KafkaResource,
  ) {
    this.app = express();
  }

  async boot() {
    await this.bootstrap
      .withResource(this.exampleResource)
      .withResource(this.kafkaResource)
      .load();

    this.app.use(bodyParser.json({ limit: '10mb' }));
    this.app.use(cookieParser());
  }

  attach(path: string, router: Router) {
    this.app.use(path, router);
  }

  start(): Promise<void> {
    // common middleware: error handler for uncaught exceptions
    const errorHandler = this.errorHandler;
    this.app.use(function (
      err: Error,
      req: ExpressRequest,
      res: ExpressResponse,
      next: NextFunction,
    ) {
      if (err) {
        errorHandler.handleHttpError(err, req, res);
        res.status(500).send(ErrorMessageGenerator.httpErrorMessage(err));
        next(err);
      } else {
        next();
      }
    });

    return new Promise(async (res) => {
      await this.boot();
      this.app.use('/', this.httpRoutes.init());
      const server = this.app.listen(this.config?.server.port, () => {
        this.logger.info(
          `Started server on port: %s pid: %d`,
          this.config?.server.port,
          process.pid,
        );
        res();
      });

      server.keepAliveTimeout = 90 * 1000;

      ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
        process.on(signal, () => {
          this.logger.info(`${signal} signal received: closing HTTP server`);
          server.close(() => {
            this.logger.info('HTTP server closed');
          });
        });
      });
    });
  }
}
