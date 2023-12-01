import { ANDROID_APP_ID, IOS_APP_ID } from '@app/constants';
import { UpdateCheckInfo } from '@app/types';

export interface CheckForUpdateArgs {
  app_version: string;
  app_id: string;
  deployment_key: string;
  package_id: string | null;
}

const android_patch_url =
  'https://quizizz-static-dev.s3.amazonaws.com/app_bundles/patch-android';
const ios_patch_url =
  'https://quizizz-static-dev.s3.amazonaws.com/app_bundles/patch-ios';

/**
 *
 * @param args
 * @returns
 */
export async function checkForUpdate(
  args: CheckForUpdateArgs,
): Promise<UpdateCheckInfo> {
  let blob_url = '';
  if (args.app_id === IOS_APP_ID) {
    blob_url = ios_patch_url;
  } else if (args.app_id === ANDROID_APP_ID) {
    blob_url = android_patch_url;
  }
  const updateCheckInfo: UpdateCheckInfo = {
    app_version: args.app_version,
    app_id: args.app_id,
    package_id: 'package_id_new',
    deployment_key: args.deployment_key,
    label: 'Updating themes in the app',
    blob_url: blob_url,
    package_hash: '123',
    size: 100,
    is_update_available: true,
    should_rollback: false,
  };

  return updateCheckInfo;
}
