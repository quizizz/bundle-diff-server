import { HttpMiddleware } from '@app/middlewares/http.middleware';
import BaseMiddleware from '@app/middlewares/base.middleware';
import { inject, injectable } from 'inversify';
import components from '@app/components';
import ContextStore from '@app/core/context-store';

/**
 * Middleware factory. Can create attachable middleware functions from BaseMiddleware class for
 * different transports.
 */
@injectable()
export default class MiddlewareFactory {
  /** constructor */
  constructor(
    @inject(components.APP_CONTEXT_STORE) private appContextStore: ContextStore,
  ) {}

  /**
   * @param Middleware BaseMiddleware class
   * @returns Attachable Express middlware
   */
  createHttpMiddleware(middleware: BaseMiddleware<any>) {
    const httpMiddleware = new HttpMiddleware(middleware, this.appContextStore);
    return httpMiddleware.exec.bind(httpMiddleware);
  }
}
