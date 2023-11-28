import BaseError from '@app/errors/base.error';

/** Unhandled error 500 */
export default class UnhandledError extends BaseError {
  constructor(args: { err?: Error; context?: any; data?: any }) {
    const { err, context, data } = args;
    super({
      msg: err?.message ?? `Unhandled Exception :: ${err?.toString()}`,
      code: 500,
      desc: 'unknown.Error',
      context,
      data,
      err,
    });
  }
}
