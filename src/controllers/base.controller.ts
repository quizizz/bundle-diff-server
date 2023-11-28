import { Request, Response } from '@app/domains/app';

/**
 * Return value from any validation method
 */
export interface ValidationResult {
  error?: {
    details: { message: string }[];
  };
  value: any;
}

/**
 * BaseController handles incoming Request from any transport.
 */
export default interface BaseController<BaseRequest extends Request> {
  /** Name of the controller */
  name: string;

  /**
   * Invoked to sanitize the request. Some examples could be converting query params from string to
   * number or safe default to value in case certain values are missing.
   * It is expected to mutate the incoming request object and hence does not expect any output.
   *
   * It is an optional action. In case it is missing, we skip the operation.
   */
  sanitize?: (input: BaseRequest) => void;

  /**
   *  Invoked to validate the request. Any library like zod or joi will be eligible as long as they
   * return ValidationResult.
   *
   * It is an optional action. In case it is missing, we skip validating the incoming request.
   */
  validate?: (input: BaseRequest) => void | ValidationResult;

  /**
   * Primary request handler.
   */
  exec(
    req: BaseRequest,
  ):
    | void
    | Response<unknown>
    | Promise<void>
    | Promise<Response<unknown>>
    | never;
}
