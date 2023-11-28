import type Config from '@app/config';
import components from '@app/components';
import { injectable, inject } from 'inversify';

/**
 * ContextStore stores global context. Avoid using this unless you have some very
 * specific use case.
 * As an example, config is stored in the instance. Items can be added or removed at
 * injection or during runtime.
 */
@injectable()
export default class ContextStore {
  resource: Record<string, any> = {};

  constructor(@inject(components.CONFIG) public config: Config) {}

  getConfig(): Config {
    return this.config;
  }

  /**
   * Typeless or unknown resources can go here, all typed resources must have
   * separate getter and setter like config
   **/
  add<T>(key: string, value: T) {
    this.resource[key] = value;
  }

  get<T>(key: string): T {
    return this.resource[key];
  }
}
