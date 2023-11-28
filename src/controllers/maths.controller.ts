import { Request } from '@app/domains/app';
import BaseController from './base.controller';
import is from 'is_js';
import { injectable } from 'inversify';

@injectable()
export default class MathsController {
  add(): BaseController<{ body: { a: number; b: number } } & Request> {
    return {
      name: 'add-controller',
      validate: (req) => {
        const {
          body: { a, b },
        } = req;
        if (is.not.number(a) || is.not.number(b)) {
          return {
            error: {
              details: [{ message: 'a and b in body are not numbers' }],
            },
            value: req,
          };
        }
      },
      exec(req) {
        const {
          body: { a, b },
        } = req;
        return { data: a + b };
      },
    };
  }
  subtract(): BaseController<{ body: { a: number; b: number } } & Request> {
    return {
      name: 'subtract-controller',
      validate: (req) => {
        const {
          body: { a, b },
        } = req;
        if (is.not.number(a) || is.not.number(b)) {
          return {
            error: {
              details: [{ message: 'a and b in body are not numbers' }],
            },
            value: req,
          };
        }
      },
      exec(req) {
        const {
          body: { a, b },
        } = req;
        return { data: a - b };
      },
    };
  }
}
