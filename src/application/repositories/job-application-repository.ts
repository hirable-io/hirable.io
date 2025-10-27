import { JobApplication } from '@/domain';

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
    }>;

    export type Output = Array<JobApplication>;
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
  list(input: JobApplicationRepository.List.Input): Promise<JobApplicationRepository.List.Output>;
  delete(input: JobApplicationRepository.Delete.Input): Promise<JobApplicationRepository.Delete.Output>;
}