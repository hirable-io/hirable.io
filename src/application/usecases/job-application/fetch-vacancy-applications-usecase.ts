import { NotFoundError } from '@/application/errors';
import { CompanyRepository, JobApplicationRepository, VacancyRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { JobApplication } from '@/domain';

export class FetchVacancyApplicationsUseCase {
  constructor(
    private readonly validator: Validator<FetchVacancyApplicationsUseCase.Input>,
    private readonly companyRepository: CompanyRepository,
    private readonly vacancyApplicationsRepository: VacancyRepository,
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(input: FetchVacancyApplicationsUseCase.Input): Promise<FetchVacancyApplicationsUseCase.Output> {
    const validatedInput = await this.validator.validate(input);

    const company = await this.companyRepository.findBy({ userId: validatedInput.userId });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    const vacancy = await this.vacancyApplicationsRepository.findBy({
      id: validatedInput.vacancyId,
    });

    if (!vacancy || vacancy.companyId !== company.id) {
      throw new NotFoundError('Vacancy not found');
    }

    const { jobApplications, total } = await this.jobApplicationRepository.list(
      { vacancyId: vacancy.id },
      { candidate: true },
    );

    return {
      jobApplications,
      total,
    };
  }
}

export namespace FetchVacancyApplicationsUseCase {
  export type Input = {
    userId: string;
    vacancyId: string;
  };

  export type Output = {
    jobApplications: JobApplication[];
    total: number;
  }
}