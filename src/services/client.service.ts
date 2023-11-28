import { UpdateCheckInfo } from '@app/types';

export interface CheckForUpdateArgs {
  appVersion: string;
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
    packageId: 0,
    downloadURL:
      'https://drive.google.com/uc?export=download&id=1bnTmtBO5JForqxGMbYuuwmQ_UIEFEJlq',
    isAvailable: true,
    isDisabled: false,
    isMandatory: false,
    appVersion: args.appVersion,
    targetBinaryRange: '',
    packageHash: '',
    label: 'Download update - 7.63',
    packageSize: 0,
  };

  return updateCheckInfo;
}
