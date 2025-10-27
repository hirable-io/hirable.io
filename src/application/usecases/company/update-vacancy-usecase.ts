import { NotFoundError } from '@/application/errors';
import { CompanyRepository, VacancyRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { Modality, Tag, Vacancy, VacancyStatus } from '@/domain';

export class UpdateVacancyUseCase {
  constructor(
    private readonly validator: Validator<UpdateVacancyUseCase.Input>,
    private readonly companyRepository: CompanyRepository,
    private readonly vacancyRepository: VacancyRepository,
  ) {}

  async execute(input: UpdateVacancyUseCase.Input): Promise<UpdateVacancyUseCase.Output> {
    const { userId, data } = await this.validator.validate(input);

    const company = await this.findCompany(userId);

    const updatedVacancy = await this.updateVacancy(input.vacancyId, company.id, data);

    return updatedVacancy;
  }

  private async findCompany(userId: string) {
    const company = await this.companyRepository.findBy({ userId });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    return company;
  }

  private async updateVacancy(vacancyId: string, companyId: string, data: UpdateVacancyUseCase.Input['data']) {
    const findedVacancy = await this.vacancyRepository.findBy({ id: vacancyId });

    if (!findedVacancy) {
      throw new NotFoundError('Vacancy not found');
    }

    if (findedVacancy.companyId !== companyId) {
      throw new NotFoundError('Vacancy not found');
    }

    const updatedVacancy = await this.vacancyRepository.update(vacancyId, data);

    return updatedVacancy!;
  }
}

export namespace UpdateVacancyUseCase {
  export type Input = {
    userId: string;
    vacancyId: string;
    data: {
      title: string;
      description: string;
      location: string;
      minimumSalaryValue: number;
      maximumSalaryValue: number;
      status: VacancyStatus;
      modality: Modality;
      tags?: Array<Tag>;
    }
  }

  export type Output = Vacancy;
}