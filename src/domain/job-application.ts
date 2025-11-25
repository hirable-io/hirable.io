import { Candidate } from './candidate';
import { Vacancy } from './vacancy';

export type JobApplication = {
  id: string;
  candidateId: string;
  status: JobApplicationStatus;
  vacancyId: string;
  applicationDate: Date;
  vacancy?: Vacancy;
  candidate?: Candidate
};

export const JobApplicationStatuses = {
  NEW: 'NEW',
  REVIEWED: 'REVIEWED',
  ANALISYS: 'ANALISYS',
  REJECTED: 'REJECTED',
  HIRED: 'HIRED',
} as const;

export type JobApplicationStatus = keyof typeof JobApplicationStatuses;