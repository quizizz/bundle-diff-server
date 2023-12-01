import { Request } from '@app/domains/app';
import BaseController from './base.controller';
import is from 'is_js';
import { injectable } from 'inversify';
import {
  CheckForUpdateArgs,
  checkForUpdate,
} from '@app/services/client.service';
import { ANDROID_APP_ID, IOS_APP_ID } from '@app/constants';

@injectable()
export default class ClientController {
  checkForUpdate(): BaseController<
    {
      body: CheckForUpdateArgs;
    } & Request
  > {
    return {
      name: 'check-update-controller',
      validate: (req) => {
        const {
          body: { app_version, deployment_key, app_id },
        } = req;
        if (is.not.string(app_version)) {
          return {
            error: {
              details: [{ message: 'app_version must be a string' }],
            },
            value: req,
          };
        }
        if (is.not.string(deployment_key)) {
          return {
            error: {
              details: [{ message: 'deployment_key must be a string' }],
            },
            value: req,
          };
        }
        if (is.not.string(app_id)) {
          return {
            error: {
              details: [{ message: 'app_id must be a string' }],
            },
            value: req,
          };
        }
        if (app_id !== IOS_APP_ID && app_id !== ANDROID_APP_ID) {
          return {
            error: {
              details: [
                {
                  message: `Invalid app_id. Must be either ${ANDROID_APP_ID} or ${IOS_APP_ID}`,
                },
              ],
            },
            value: req,
          };
        }
      },
      async exec(req) {
        const {
          body: { app_version, deployment_key, package_id, app_id },
        } = req;
        const data = await checkForUpdate({
          app_version: app_version,
          deployment_key: deployment_key,
          app_id: app_id,
          package_id: package_id,
        });
        return {
          data: data,
        };
      },
    };
  }
}
