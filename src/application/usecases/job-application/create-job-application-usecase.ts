import { AlreadyExistsError, NotFoundError } from '@/application/errors';
import { CandidateRepository, JobApplicationRepository, VacancyRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { Candidate, JobApplication } from '@/domain';
import { randomUUID } from 'node:crypto';

export class CreateJobApplicationUseCase {
  constructor(
    private readonly validator: Validator<CreateJobApplicationUseCase.Input>,
    private readonly vacancyRepository: VacancyRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(input: CreateJobApplicationUseCase.Input): Promise<CreateJobApplicationUseCase.Output> {
    const { userId, vacancyId } = await this.validator.validate(input);

    const candidate = await this.findCandidate(userId);
    await this.findVacancy(vacancyId);

    const jobApplication = await this.createJobApplication(candidate, vacancyId);

    return jobApplication;
  }

  private async findVacancy(vacancyId: string) {
    const vacancy = await this.vacancyRepository.findBy({ id: vacancyId });

    if (!vacancy) {
      throw new NotFoundError('Vacancy not found');
    }

    return vacancy;
  }

  private async findCandidate(userId: string) {
    const candidate = await this.candidateRepository.findBy({ userId });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    return candidate;
  }

  private async createJobApplication(candidate: Candidate, vacancyId: string) {
    const alreadyApplied = await this.jobApplicationRepository.findBy({
      candidateId: candidate.id,
      vacancyId,
    });

    if (alreadyApplied) {
      throw new AlreadyExistsError('Job application already exists');
    }

    const jobApplication = await this.jobApplicationRepository.create({
      candidateId: candidate.id,
      vacancyId,
      applicationDate: new Date(),
      id: randomUUID(),
    });

    return jobApplication;
  }
}

export namespace CreateJobApplicationUseCase {
  export type Input = {
    userId: string;
    vacancyId: string;
  };

  export type Output = JobApplication;
}