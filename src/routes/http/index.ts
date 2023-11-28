import { ILogger } from '@app/core/logger';
import { injectable, inject } from 'inversify';
import { Router } from 'express';
import BaseMiddleware from '@app/middlewares/base.middleware';
import components from '@app/components';
import Config from '@app/config';
import MiddlewareFactory from '@app/middlewares/factory.middleware';
import type { ControllerFactory } from '@app/routes/handlers/handler.factory';
import type BaseController from '@app/controllers/base.controller';
import MathsController from '@app/controllers/maths.controller';
import { MetaController, NotFoundController } from '@app/controllers';
import { HealthController } from '@app/controllers/meta.controller';

/**
 *
 * @param route string
 * @param apiver string
 * @param type strinig
 * @returns string
 */
function getComponentRoute(
  route: string,
  apiver: string,
  type: string,
): string {
  return `/_${type}/${apiver}${route}`;
}

/**
 * Init routes
 */
@injectable()
export class HttpRoutes {
  constructor(
    @inject(components.CONTROLLER_FACTORY) private factory: ControllerFactory,
    @inject(components.META_CONTROLLER) private metaController: MetaController,
    @inject(components.HEALTH_CONTROLLER)
    private healthController: HealthController,
    @inject(components.NOT_FOUND_CONTROLLER)
    private notFoundController: NotFoundController,
    @inject(components.MATHS_CONTROLLER)
    private mathsController: MathsController,
    @inject(components.CONFIG) private config: Config,
    @inject(components.LOGGER) private logger: ILogger,
    @inject(components.MIDDLEWARE_FACTORY)
    private middleware: MiddlewareFactory,
  ) {}

  register(
    router: Router,
    routes: Array<{
      method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
      route: string;
      middlewares?: Array<BaseMiddleware<any>>;
      controller: BaseController<any>;
    }>,
  ): Router {
    for (const { method, route, middlewares = [], controller } of routes) {
      router[method](
        route,
        middlewares.map((middleware) =>
          this.middleware.createHttpMiddleware(middleware),
        ),
        this.factory.createHttpController(controller),
      );
    }
    return router;
  }

  /**
   * Create v1 apis
   * @returns Express Router
   */
  v1() {
    return this.register(Router(), [
      {
        method: 'post',
        route: '/maths/add',
        controller: this.mathsController.add(),
      },
      {
        method: 'post',
        route: '/maths/subtract',
        controller: this.mathsController.subtract(),
      },
    ]);
  }

  /**
   * Create health check and diagnosis routes
   * @returns Express Router
   */
  meta() {
    return this.register(Router(), [
      { method: 'get', route: '/ab', controller: this.metaController },
      { method: 'get', route: '/health', controller: this.healthController },
    ]);
  }

  addRouteController(route: string, controller: Router, base: Router): void {
    base.use(route, controller);
    const componentRoute = getComponentRoute(
      route,
      this.config.apiver,
      this.config.componentType,
    );
    this.logger.info('Mount route for : %s', componentRoute);
    base.use(componentRoute, controller);
  }

  /** init */
  init(): Router {
    const base = Router();
    this.addRouteController('/_meta/', this.meta(), base);
    this.addRouteController('/v1/', this.v1(), base);
    base.use('*', this.factory.createHttpController(this.notFoundController));
    return base;
  }
}
