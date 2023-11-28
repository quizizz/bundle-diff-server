import BaseError from '@app/errors/base.error';

/** Error handler for 403 unauthorized */

export default class ForbiddenError extends BaseError {
  constructor(args: {
    msg?: string;
    context?: any;
    data?: any;
    resourceName?: string;
  }) {
    const { msg, context, data, resourceName } = args;
    super({
      msg:
        msg ??
        `User is forbidden/unauthorized to carry out the action on ${resourceName}`,
      code: 403,
      desc: `${resourceName}.FORBIDDEN`,
      context,
      data,
    });
  }
}
