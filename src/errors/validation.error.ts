import BaseError from '@app/errors/base.error';

/** Validation error 400 */
export default class ValidationError extends BaseError {
  override code = 400;

  constructor(args: { msg?: string; context?: any; data?: any }) {
    const { msg, context, data } = args;
    super({
      msg: msg ?? 'Validation error',
      code: 400,
      desc: 'validation.Error',
      context,
      data,
    });
  }
}
