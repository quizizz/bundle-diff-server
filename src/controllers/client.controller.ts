import { Request } from '@app/domains/app';
import BaseController from './base.controller';
import is from 'is_js';
import { injectable } from 'inversify';
import { checkForUpdate } from '@app/services/client.service';

@injectable()
export default class ClientController {
  checkForUpdate(): BaseController<
    {
      body: {
        appVersion: string;
      };
    } & Request
  > {
    return {
      name: 'check-update-controller',
      validate: (req) => {
        const {
          body: { appVersion },
        } = req;
        if (is.not.string(appVersion)) {
          return {
            error: {
              details: [{ message: 'appVersion must be a string' }],
            },
            value: req,
          };
        }
      },
      async exec(req) {
        const {
          body: { appVersion },
        } = req;
        const data = await checkForUpdate({
          appVersion: appVersion,
        });
        return {
          data: data,
        };
      },
    };
  }
}
