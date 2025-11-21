export type JobApplication = {
  id: string;
  candidateId: string;
  status: JobApplicationStatus;
  vacancyId: string;
  applicationDate: Date;
};

export const JobApplicationStatuses = {
  NEW: 'NEW',
  REVIEWED: 'REVIEWED',
  ANALISYS: 'ANALISYS',
} as const;

export type JobApplicationStatus = keyof typeof JobApplicationStatuses;