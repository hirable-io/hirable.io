import { NotFoundError } from '@/application/errors';
import { CandidateRepository, JobApplicationRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { JobApplication } from '@/domain';

export class FetchCandidateApplicationsUseCase {
  constructor(
    private readonly validator: Validator<FetchCandidateApplicationsUseCase.Input>,
    private readonly candidateRepository: CandidateRepository,
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(input: FetchCandidateApplicationsUseCase.Input): Promise<FetchCandidateApplicationsUseCase.Output> {
    const { userId } = await this.validator.validate(input);

    const candidate = await this.candidateRepository.findBy({ userId });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    const { jobApplications, total } = await this.jobApplicationRepository.list({
      candidateId: candidate.id,
    }, { vacancy: true });

    return { jobApplications, total };
  }
}

export namespace FetchCandidateApplicationsUseCase {
  export type Input = {
    userId: string;
  }

  export type Output = {
    jobApplications: JobApplication[];
    total: number;
  };
}