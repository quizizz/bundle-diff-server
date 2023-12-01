export enum ENV {
  prod = 'prod',
  dev = 'dev',
  local = 'local',
  test = 'test',
}

export type PartialRecord<K extends string, V> = Partial<Record<K, V>>;

export type RequestMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'UNKNOWN'
  | 'KAFKA';

export interface UpdateCheckInfo {
  app_version: string;
  app_id: string;
  package_id: string | null;
  deployment_key: string;
  label: string | null;
  blob_url: string | null;
  package_hash: string | null;
  size: number | null;
  is_update_available: boolean;
  is_rollout_disabled: boolean;
}
