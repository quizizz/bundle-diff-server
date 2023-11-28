import { Locals, Request } from '@app/domains/app';

/** Base middleware, app agnostic */
export default interface BaseMiddleware<BaseRequest extends Request> {
  exec(req?: BaseRequest): Promise<void | Partial<Locals>>;
}
