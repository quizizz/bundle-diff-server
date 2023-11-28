import BaseError from '@app/errors/base.error';

/** Error handler for 401 */
export default class AuthenticationError extends BaseError {
  override code = 401;
  override context: any = null;
  trace: any;
  constructor(args: { msg?: string; context?: any; data?: any }) {
    const { msg, context, data } = args;
    super({
      msg: msg ?? 'Unauthorized request',
      code: 401,
      desc: 'auth.ERROR',
      context,
      data,
    });
  }
}
