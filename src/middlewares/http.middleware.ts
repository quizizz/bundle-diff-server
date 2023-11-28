import { Locals, Request } from '@app/domains/app';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';
import BaseMiddleware from '@app/middlewares/base.middleware';
import ContextStore from '@app/core/context-store';

/** Wrapper over basemiddleware to act as http middleware */
export class HttpMiddleware {
  constructor(
    private middleware: BaseMiddleware<any>,
    private appContextStore: ContextStore,
  ) {}

  /** Main execution method */
  async exec(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction,
  ): Promise<void> {
    const { body, query, params, headers, cookies } = req;
    const { locals = {} } = res as { locals: Locals };
    const request: Request<any, any, any> = {
      body,
      query,
      params,
      headers,
      cookies,
      context: { ...locals, appContextStore: this.appContextStore },
    };
    try {
      const result = await this.middleware.exec(request);
      if (result) {
        res.locals = Object.assign(locals, result);
      }
      next();
    } catch (err: any) {
      // for middlewares, we do not need to explicitly handle error, they are handled by a error
      // handling middleware which handles all uncaught exceptions
      next(err);
    }
  }
}
