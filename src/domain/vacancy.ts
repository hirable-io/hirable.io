import { VacancyTag } from './vacancy-tag';

export const VacancyStatuses = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type VacancyStatus = keyof typeof VacancyStatuses;

export const Modalities = {
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
  ONSITE: 'ONSITE',
} as const;

export type Modality = keyof typeof Modalities;

export type Vacancy = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  minimumSalaryValue: number;
  maximumSalaryValue: number;
  status: VacancyStatus;
  modality: Modality;
  createdAt: Date;
  tags?: Array<VacancyTag>
  updatedAt: Date;
};