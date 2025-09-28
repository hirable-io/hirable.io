import { DataSource } from 'typeorm';
import { env } from '@/env';
import logger from '@/infra/logger';

const defaultConfig = {
  migrationsRun: true,
  entities: [],
  migrations: [],
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
