import { JobApplication, JobApplicationStatus } from '@/domain';

export namespace JobApplicationRepository {
  export namespace Create {
    export type Input = JobApplication;
    export type Output = JobApplication;
  }

  export namespace FindBy {
    export type Input = {
      candidateId: string;
      vacancyId: string;
    };

    export type Output = JobApplication | null;
  }

  export namespace List {
    export type Input = Partial<{
      candidateId: string;
      vacancyId: string;
      limit?: number;
      offset?: number;
    }>;

    export type Relations = Partial<{
      candidate: boolean;
      vacancy: boolean;
    }>;

    export type Output = {
      jobApplications: JobApplication[];
      total: number;
    };
  }

  export namespace SetStatus {
    export type Input = {
      id: string;
      status: JobApplicationStatus;
    };

    export type Output = JobApplication;
  }

  export namespace Delete {
    export type Input = {
      id: string;
    };

    export type Output = void;
  }
}

export interface JobApplicationRepository {
  create(input: JobApplicationRepository.Create.Input): Promise<JobApplicationRepository.Create.Output>;
  findBy(input: JobApplicationRepository.FindBy.Input): Promise<JobApplicationRepository.FindBy.Output>;
  list(input: JobApplicationRepository.List.Input, relations?: JobApplicationRepository.List.Relations): Promise<JobApplicationRepository.List.Output>;
  delete(input: JobApplicationRepository.Delete.Input): Promise<JobApplicationRepository.Delete.Output>;
}