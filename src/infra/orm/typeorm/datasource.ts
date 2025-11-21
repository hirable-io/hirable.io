import { DataSource } from 'typeorm';
import { env } from '@/env';
import logger from '@/infra/logger';
import {
  UserEntity,
  CompanyEntity,
  CandidateEntity,
  TagEntity,
  VacancyEntity,
  JobApplicationEntity,
} from '@/infra/orm/typeorm/entities';
import {
  AddInitialEntities,
  AddImageUrlToUser,
  AddLinkedidUrlToCandidate,
  AddPhoneToCandidateEntity,
  CreateVacancyEntity,
  UpdateVacancyRelations,
  CreateJobApplicationEntity,
  AddCascadeToJobApplication,
  AddStatusToJobApplication,
} from '@/infra/orm/typeorm/migrations';

const defaultConfig = {
  migrationsRun: true,
  entities: [
    UserEntity,
    CompanyEntity,
    CandidateEntity,
    TagEntity,
    VacancyEntity,
    JobApplicationEntity,
  ],
  migrations: [
    AddInitialEntities,
    AddImageUrlToUser,
    AddLinkedidUrlToCandidate,
    AddPhoneToCandidateEntity,
    CreateVacancyEntity,
    UpdateVacancyRelations,
    CreateJobApplicationEntity,
    AddCascadeToJobApplication,
    AddStatusToJobApplication,
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
