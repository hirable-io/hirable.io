import { DataSource } from 'typeorm';
import { env } from '@/env';
import logger from '@/infra/logger';
import {
  UserEntity,
  CompanyEntity,
  CandidateEntity,
  TagEntity,
} from '@/infra/orm/typeorm/entities';
import {
  AddInitialEntities,
} from '@/infra/orm/typeorm/migrations';

const defaultConfig = {
  migrationsRun: true,
  entities: [
    UserEntity,
    CompanyEntity,
    CandidateEntity,
    TagEntity,
  ],
  migrations: [
    AddInitialEntities,
  ],
};

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: env.DB_PORT,
  url: env.POSTGRES_URL,
  ...defaultConfig,
});

export async function dbConnection() {
  try {
    await dataSource.initialize();
    logger.info('✅ Database connected');
  } catch (error) {
    logger.error(error, 'Error on connecting to database');
    throw new Error('Error on connecting to database');
  }
}
