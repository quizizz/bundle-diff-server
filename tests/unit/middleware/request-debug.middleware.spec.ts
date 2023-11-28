import 'reflect-metadata';

import BaseMiddleware from '@app/middlewares/base.middleware';
import { RequestDebugMiddleware } from '@app/middlewares/request-debug.middleware';
import AsyncStorageService, {
  AsyncStore,
} from '@app/services/async-storage.service';
import { NewRequest } from '@app/domains/app';

describe('[Middleware] Request Level Debug', () => {
  let contextStorageService: AsyncStorageService;
  let middleware: BaseMiddleware;
  let asyncStore: AsyncStore = {
    ab: '',
    action: '',
    reqStartTime: 0,
    traceId: '',
    userId: '',
    debug: false,
  };

  beforeEach(() => {
    contextStorageService = new AsyncStorageService();
    middleware = new RequestDebugMiddleware(contextStorageService);
    asyncStore = {
      ab: '',
      action: '',
      reqStartTime: 0,
      traceId: '',
      userId: '',
      debug: false,
    };
  });

  it('If the context store already has debug as true, it keeps that value', async () => {
    await contextStorageService.getInstance().run(asyncStore, async () => {
      const store = contextStorageService.mustGetStore();
      store.debug = true;

      await middleware.exec();

      expect(store.debug).toBe(true);
    });
  });

  it('If the debug cookie is passed, it sets the debug value to true', async () => {
    await contextStorageService.getInstance().run(asyncStore, async () => {
      await middleware.exec(
        NewRequest({
          cookies: {
            'x-q-debug': 'true',
          },
        }),
      );

      const store = contextStorageService.mustGetStore();
      expect(store.debug).toBe(true);
    });
  });

  it('If the debug header is passed, it sets the debug value to true', async () => {
    await contextStorageService.getInstance().run(asyncStore, async () => {
      await middleware.exec(
        NewRequest({
          headers: {
            'x-q-debug': 'true',
          },
        }),
      );

      const store = contextStorageService.mustGetStore();
      expect(store.debug).toBe(true);
    });
  });
});
