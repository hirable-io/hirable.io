import { InfraDI } from '../infra';

export function configureServices(container: InfraDI) {
  return container;
}

export type ServicesDI = ReturnType<typeof configureServices>;
