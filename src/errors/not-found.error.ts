import BaseError from '@app/errors/base.error';

/** Error handler for 404 */
export default class NotFoundError extends BaseError {
  constructor(args: { msg?: string; context?: any; data?: any }) {
    const { msg, context, data } = args;
    super({
      msg: msg ?? 'Resource not found',
      code: 404,
      desc: 'resource.NOT_FOUND',
      context,
      data,
    });
  }
}
