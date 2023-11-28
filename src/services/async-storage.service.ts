import BaseError from '@app/errors/base.error';
import { injectable } from 'inversify';
import { AsyncLocalStorage } from 'node:async_hooks';

export type AsyncStore = {
  reqStartTime: number;
  traceId: string;
  userId: string;
  ab: string;
  action: string;
  spanId?: string;
  debug?: boolean;
  error_tags?: Record<string, string | number | boolean>;
};

@injectable()
export default class AsyncStorageService {
  private _storageInstance: AsyncLocalStorage<AsyncStore>;
  constructor() {
    this._storageInstance = new AsyncLocalStorage();
  }

  getInstance() {
    return this._storageInstance;
  }

  getStore() {
    const store = this._storageInstance.getStore();
    return store;
  }

  mustGetStore() {
    const store = this.getStore();
    if (!store) {
      throw new BaseError({
        msg: 'AsyncStore is undefined',
        desc: 'async_store.UNDEFINED',
      });
    }
    return store;
  }

  addErrorTag(key: string, value: string | number | boolean): void {
    const store = this.getStore();
    if (store) {
      store.error_tags = store.error_tags || {};
      store.error_tags[key] = value;
    }
  }

  getErrorTags(): AsyncStore['error_tags'] {
    const store = this.getStore();
    return store?.error_tags || {};
  }
}
