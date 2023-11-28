import 'reflect-metadata';

import Config from '@app/config';
import { ProcessEnv } from '@app/core/process-env';
import ContextStore from '@app/core/context-store';

describe('core/context-store', function () {
  const penv = new ProcessEnv();
  const config = new Config(penv);
  const sl = new ContextStore(config);

  it('should be able to set and get a value', function () {
    sl.add('key', 'value');
    expect(sl.get('key')).toBe('value');
  });
});
