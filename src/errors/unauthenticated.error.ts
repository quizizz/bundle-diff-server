import BaseError from '@app/errors/base.error';

/** Error handler for 401 unauthenticated */
export default class ForbiddenError extends BaseError {
  constructor(msg?: string, context?: any, data?: any) {
    super({
      msg: msg ?? 'User is unauthenticated',
      code: 403,
      desc: 'resource.UNAUTHENTICATED',
      context,
      data,
    });
  }
}
