import { UpdateCheckInfo } from '@app/types';

export interface CheckForUpdateArgs {
  app_version: string;
  app_id: string;
  deployment_key: string;
  package_id: string | null;
}

/**
 *
 * @param args
 * @returns
 */
export async function checkForUpdate(
  args: CheckForUpdateArgs,
): Promise<UpdateCheckInfo> {
  const updateCheckInfo: UpdateCheckInfo = {
    app_version: args.app_version,
    app_id: args.app_id,
    package_id: 'package_id_1',
    deployment_key: args.deployment_key,
    label: 'Updating themes in the app',
    blob_url:
      'https://quizizz-static-dev.s3.amazonaws.com/app_bundles/patch-android',
    package_hash: '123',
    size: 100,
    is_update_available: true,
    is_rollout_disabled: false,
  };

  return updateCheckInfo;
}
