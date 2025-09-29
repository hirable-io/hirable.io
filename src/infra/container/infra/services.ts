import { RepositoriesDI } from './repositories';

export function configureServices(container: RepositoriesDI) {
  return container;
}

export type ServicesDI = ReturnType<typeof configureServices>;
