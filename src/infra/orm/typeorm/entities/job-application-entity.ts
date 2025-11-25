import { Candidate, Vacancy, JobApplication } from '@/domain';
import { EntitySchema } from 'typeorm';

export type JobApplicationSchema = JobApplication & {
  candidate?: Candidate;
  vacancy?: Vacancy;
}

export const JobApplicationEntity = new EntitySchema<JobApplicationSchema>({
  name: 'job_applications',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    candidateId: {
      name: 'candidate_id',
      type: 'uuid',
    },
    status: {
      name: 'status',
      type: 'varchar',
    },
    vacancyId: {
      name: 'vacancy_id',
      type: 'uuid',
    },
    applicationDate: {
      name: 'application_date',
      type: 'timestamp',
    },
  },
  relations: {
    candidate: {
      type: 'many-to-one',
      target: 'candidates',
      joinColumn: { name: 'candidate_id' },
      inverseSide: 'jobApplications',
      onDelete: 'CASCADE',
    },
    vacancy: {
      type: 'many-to-one',
      target: 'vacancies',
      joinColumn: { name: 'vacancy_id' },
      inverseSide: 'jobApplications',
      onDelete: 'CASCADE',
    },
  },
});