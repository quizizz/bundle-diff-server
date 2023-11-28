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
  packageId: number;
  downloadURL: string;
  isAvailable: boolean;
  isDisabled: boolean; // If we do a rollback
  isMandatory: boolean;
  appVersion: string;
  targetBinaryRange: string;
  packageHash: string;
  label: string;
  packageSize: number;
}
