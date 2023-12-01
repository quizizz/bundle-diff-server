import { AppReleaseArgs } from './types';

/**
 *
 * @param args
 * @returns
 */
export async function releaseApp(args: AppReleaseArgs): Promise<void> {
  console.log(args);
  const old_bundle_data = 'old_data';
  const patch_data = args.patch_data;
}
