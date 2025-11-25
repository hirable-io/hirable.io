import { EntitySchema } from 'typeorm';
import { Company, JobApplication, Vacancy } from '@/domain';
import { BaseEntity } from './base-entity';

export type VacancySchema = Vacancy & {
  company?: Company,
  jobApplications?: Array<JobApplication>,
};

export const VacancyEntity = new EntitySchema<VacancySchema>({
  name: 'vacancies',
  columns: {
    ...BaseEntity,
    companyId: {
      name: 'company_id',
      type: 'uuid',
    },
    title: {
      name: 'title',
      type: 'varchar',
    },
    description: {
      name: 'description',
      type: 'text',
    },
    location: {
      name: 'location',
      type: 'varchar',
    },
    minimumSalaryValue: {
      name: 'minimum_salary_value',
      type: 'int',
    },
    maximumSalaryValue: {
      name: 'maximum_salary_value',
      type: 'int',
    },
    status: {
      name: 'status',
      type: 'varchar',
    },
    modality: {
      name: 'modality',
      type: 'varchar',
    },
  },
  relations: {
    company: {
      type: 'many-to-one',
      target: 'companies',
      joinColumn: { name: 'company_id' },
      inverseSide: 'vacancy',
    },
    tags: {
      type: 'many-to-many',
      target: 'tags',
      joinTable: {
        name: 'vacancy_tags',
        joinColumn: { name: 'vacancy_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
      },
    },
    jobApplications: {
      type: 'one-to-many',
      target: 'job_applications',
      inverseSide: 'vacancy',
    },
  }
});