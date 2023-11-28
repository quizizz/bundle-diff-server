import { parse, types } from 'mapofenv';
const { string, number, boolean, json } = types;
import { ENV } from '@app/types';
import { randomUUID } from 'crypto';
import { injectable, inject } from 'inversify';
import components from '@app/components';
import { ProcessEnv } from '@app/core/process-env';
import ObjectID from 'bson-objectid';

@injectable()
export default class Config {
  id: string = ObjectID().toHexString();
  env = '';
  type = '';
  service = '';
  instance: string = string(randomUUID());
  commitId: string = string('local');
  runversion: string = string('local');
  apiver: string = string('main');
  componentType: string = string('template');
  server: { port: number } = {
    port: number(8080),
  };
  app: { kind: string; debug: { use: boolean; level: number } } = {
    kind: string('server'),
    debug: {
      use: boolean(false),
      level: number(5),
    },
  };
  aws?: { region?: string } = json({
    region: 'us-east-1',
  });
  kafka: {
    enableConsumer: boolean;
    groupId?: string;
    brokers: [];
    topics?: {
      [topicName: string]: {
        groupId: string;
      };
    };
  } = {
    enableConsumer: boolean(false),
    groupId: string('template-service'),
    brokers: json([
      '54.163.209.78:9092',
      '52.201.103.122:9092',
      '34.234.67.78:9092',
    ]),
  };

  constructor(@inject(components.ENV) private processEnv: ProcessEnv) {
    this.env = string(processEnv.env);
    this.service = string(this.processEnv.service);
    this.type = string(this.processEnv.appType);
    this.kafka.groupId = string(this.processEnv.getServiceType());
  }

  private select<T>(env: ENV, forProd: T, forDev: T): T {
    return env === 'prod' ? forProd : forDev;
  }

  /**
   * Creates a certificate format string from key stored in the secret vault
   * @returns Final formatted certificate string
   */
  private privateKey() {
    return (val?: string) => {
      if (!val) {
        return null;
      }
      const content = val.split(':').join('\n');
      return `-----BEGIN PRIVATE KEY-----\n${content}\n-----END PRIVATE KEY-----\n`;
    };
  }

  /**
   *
   * @param service
   * @param env
   * @returns
   */
  public async load(): Promise<void> {
    const config: Record<keyof Config, any> = parse(this, {
      prefix: [
        'NODE',
        'N',
        `Q_${this.processEnv.service.toUpperCase()}`,
        'Q',
        'QUIZIZZ',
      ], // decreasing precendence of namespace
    });
    Object.keys(config).forEach((k) => {
      this[k] = config[k];
    });
  }
}
