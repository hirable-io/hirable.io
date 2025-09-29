import { DIContainer } from 'rsdi';
import { dataSource } from '@/infra/orm/typeorm/datasource';
import {
  UserTypeOrmRepository,
  CandidateTypeOrmRepository,
  CompanyTypeOrmRepository
} from '@/infra/orm/typeorm/repositories';

export function configureRepositories() {
  return new DIContainer()
    .add('Datasource', () => dataSource)
    .add('DatasourceManager', () => dataSource.manager)
    .add('UserRepository', () => new UserTypeOrmRepository(dataSource))
    .add('CandidateRepository', () => new CandidateTypeOrmRepository(dataSource))
    .add('CompanyRepository', () => new CompanyTypeOrmRepository(dataSource));
}

export type RepositoriesDI = ReturnType<typeof configureRepositories>;
