import { DIContainer } from 'rsdi';
import { dataSource } from '@/infra/orm/typeorm/datasource';

export function configureRepositories() {
  return new DIContainer()
    .add('Datasource', () => dataSource)
    .add('DatasourceManager', () => dataSource.manager);
}

export type RepositoriesDI = ReturnType<typeof configureRepositories>;
