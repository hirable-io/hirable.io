import { RepositoriesDI } from './repositories';
import { HashingBcryptService } from '@/infra/services';

export function configureServices(container: RepositoriesDI) {
  return container
    .add('HashingService', () => new HashingBcryptService());
}

export type ServicesDI = ReturnType<typeof configureServices>;
