import { Validator } from '@/application/services';
import { NotFoundError } from '@/application/errors';
import { CompanyRepository, VacancyRepository } from '@/application/repositories';

export class DeleteVacancyUseCase {
  constructor(
    private readonly validator: Validator<DeleteVacancyUseCase.Input>,
    private readonly companyRepository: CompanyRepository,
    private readonly vacancyRepository: VacancyRepository,
  ) {}

  async execute(input: DeleteVacancyUseCase.Input): Promise<DeleteVacancyUseCase.Output> {
    const { vacancyId, userId } = await this.validator.validate(input);

    const company = await this.findCompany(userId);

    const vacancy = await this.findVacancy(vacancyId, company.id);

    await this.vacancyRepository.delete({ id: vacancy.id });
  }

  private async findCompany(userId: string) {
    const company = await this.companyRepository.findBy({ userId });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    return company;
  }

  private async findVacancy(vacancyId: string, companyId: string) {
    const vacancy = await this.vacancyRepository.findBy({ id: vacancyId });

    if (!vacancy) {
      throw new NotFoundError('Vacancy not found');
    }

    if (vacancy.companyId !== companyId) {
      throw new NotFoundError('Vacancy not found');
    }

    return vacancy;
  }
}

export namespace DeleteVacancyUseCase {
  export type Input = {
    userId: string;
    vacancyId: string;
  };

  export type Output = void;
}