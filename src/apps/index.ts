import { AppFactory } from '@app/apps/factory.app';
import { injectable, inject } from 'inversify';
import components from '@app/components';

/**
 * Main function to start the application
 */
@injectable()
export class Main {
  constructor(@inject(components.APP_FACTORY) private appFactory: AppFactory) {}

  async run() {
    const app = this.appFactory.getApp();
    await app.start();
  }
}
