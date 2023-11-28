import Resource from './resource';
import Config from '@app/config';
import components from '@app/components';
import Emitter from '@app/core/emitter';
import { injectable, inject } from 'inversify';

@injectable()
export default class ExampleResource implements Resource {
  constructor(
    @inject(components.CONFIG) private config: Config,
    @inject(components.EMITTER) private emitter: Emitter,
  ) {}

  async load() {
    this.emitter.getEmitter().emit('log', {
      service: 'example',
      message: 'loading up',
      data: {
        time: new Date(),
      },
    });
    this.emitter.getEmitter().emit('success', {
      service: 'example',
      message: 'loaded up',
    });
    return;
  }
}
