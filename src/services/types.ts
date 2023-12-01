export interface CheckForUpdateArgs {
  app_version: string;
  app_id: string;
  deployment_key: string;
  package_id: string | null;
}

export interface AppReleaseArgs {
  app_version: string;
  app_id: string;
  deployment_key: string;
  patch_data: string;
}
