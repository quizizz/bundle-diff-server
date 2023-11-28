import BaseError from '@app/errors/base.error';
import is from 'is_js';

/**
 * Contains result which can be error or ok
 */
export default class Result<T> {
  private readonly value?: T;
  private readonly error?: Error;

  constructor({ err: error, ok: value }: { err?: string; ok?: T }) {
    if (
      (is.existy(error) && is.existy(value)) ||
      (is.not.existy(error) && is.not.existy(value))
    ) {
      throw new BaseError({
        msg: 'Incorrect Result initialization',
        code: 500,
        desc: 'result.INITIALIZE',
        context: {
          error,
          value,
        },
      });
    }
    this.error = error ? new Error(error) : undefined;
    this.value = value;
  }

  isErr(): boolean {
    return is.existy(this.error);
  }

  isOk(): boolean {
    return is.existy(this.value);
  }

  err(): Error {
    if (is.not.existy(this.error)) {
      throw new BaseError({
        msg: 'Cannot extract error when it is not present',
        code: 500,
        desc: 'result.ERROR',
        context: {
          error: this.error,
          value: this.value,
        },
      });
    }
    return this.error as Error;
  }

  ok(): T {
    if (is.not.existy(this.value)) {
      throw new BaseError({
        msg: 'Cannot extract ok when it is not present',
        code: 500,
        desc: 'result.OK',
        context: {
          error: this.error,
          value: this.value,
        },
      });
    }
    return this.value as T;
  }

  static ok<T>(val: T): Result<T> {
    return new Result<T>({ ok: val });
  }

  static err<T>(msg: string): Result<T> {
    return new Result<T>({ err: msg });
  }
}
