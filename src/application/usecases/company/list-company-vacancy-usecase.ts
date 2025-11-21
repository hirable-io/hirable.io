import { NotFoundError } from '@/application/errors';
import { CompanyRepository, VacancyRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { Vacancy } from '@/domain';

export class ListCompanyVacancyUseCase {
  constructor(
    private readonly validator: Validator<ListCompanyVacancyUseCase.Input>,
    private readonly companyRepository: CompanyRepository,
    private readonly vacancyRepository: VacancyRepository,
  ) {}

  async execute(input: ListCompanyVacancyUseCase.Input): Promise<ListCompanyVacancyUseCase.Output> {
    const { userId } = await this.validator.validate(input);

    const company = await this.companyRepository.findBy({ userId });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    const { vacancies, total } = await this.vacancyRepository.findMany({
      companyId: company.id,
      limit: input.limit,
      offset: input.offset,
    });

    return {
      vacancies,
      total,
    };
  }
}

export namespace ListCompanyVacancyUseCase {
  export type Input = {
    userId: string;
    limit?: number;
    offset?: number;
  };

  export type Output = {
    vacancies: Vacancy[];
    total: number;
  }
}