import 'module-alias/register';

import 'reflect-metadata';
import { Main } from '@app/apps';
import Container from '@app/components/container';
import components from '@app/components';

/** Loads the process */
async function main() {
  const container = Container();
  const main = container.get<Main>(components.MAIN);
  await main.run();
}

// eslint-disable-next-line no-console
main().catch(console.error);
