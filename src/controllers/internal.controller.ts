import { Request } from '@app/domains/app';
import BaseController from './base.controller';
import is from 'is_js';
import { injectable } from 'inversify';
import { ANDROID_APP_ID, IOS_APP_ID } from '@app/constants';
import { AppReleaseArgs } from '@app/services/types';
import { releaseApp } from '@app/services/internal.service';

@injectable()
export default class InternalController {
  releaseApp(): BaseController<
    {
      body: AppReleaseArgs;
    } & Request
  > {
    return {
      name: 'make-release-controller',
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
                  message: `Invalid app_id`,
                },
              ],
            },
            value: req,
          };
        }
      },
      async exec(req) {
        const {
          body: { app_version, deployment_key, app_id, patch_data },
        } = req;
        const data = await releaseApp({
          app_version: app_version,
          deployment_key: deployment_key,
          app_id: app_id,
          patch_data: patch_data,
        });
        return {
          data: data,
        };
      },
    };
  }
}
