import {
  CaptureAndParseStackReturnValue,
  captureAndParseStackTrace,
} from '@quizizz/stacktrace-utils';

/**
 * Base Error class
 *
 * @param args
 * @param args.code http status code, eg 500, 404, 401, 429
 * @param args.desc this is short error code to quickly identify the error class,
 * eg. user.TOO_MANY_REQUESTS
 * @param args.context Associated metadata with the error for detailed debugging. For example, it can include things like
 * resourceId very specific to the context of error. This is logged into tools like BigQuery or Sentry. It is never sent to
 * the client, so we can put any metadata required.
 * @param args.data Helpful information related to the error which can be sent to the client. Please
 * take care to not send any sensitive information in this field.
 * @param args.parsedStack stacktrace for error handlers
 **/
export default class BaseError extends Error {
  code: number;
  desc: string;
  context: any;
  data: any;
  parsedStack: CaptureAndParseStackReturnValue;

  constructor(
    args: {
      msg?: string;
      code?: number;
      desc?: string;
      context?: any;
      data?: any;
      err?: Error;
    } = {},
  ) {
    const { msg, code, desc, context, data, err } = args;
    super(msg, { cause: err });
    this.code = code || 500;
    this.desc = desc || 'desc-ukw';
    this.context = context;
    this.data = data;
    this.parsedStack = captureAndParseStackTrace({
      startStackFunction: this.constructor,
    });
  }

  static fromError(err: Error): BaseError {
    if (err instanceof BaseError) {
      return err;
    }
    const baseErr = new BaseError({
      msg: `Unhandled Error: ${err.message ?? 'ukw'}`,
      err,
    });
    return baseErr;
  }

  static from(err: unknown) {
    let _error: BaseError;
    if (err instanceof BaseError) {
      _error = err;
    } else {
      if (err instanceof Error) {
        _error = BaseError.fromError(err);
      } else {
        _error = BaseError.fromError(new Error(String(err)));
      }
    }
    return _error;
  }
}
