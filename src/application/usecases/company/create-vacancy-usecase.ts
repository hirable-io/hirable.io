import { NotFoundError } from '@/application/errors';
import { CompanyRepository, VacancyRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { Modality, Tag, Vacancy, VacancyStatus } from '@/domain';
import { randomUUID } from 'node:crypto';

export class CreateVacancyUseCase {
  constructor(
    private readonly validator: Validator<CreateVacancyUseCase.Input>,
    private readonly companyRepository: CompanyRepository,
    private readonly vacancyRepository: VacancyRepository,
  ) {}

  async execute(input: CreateVacancyUseCase.Input): Promise<CreateVacancyUseCase.Output> {
    const { userId, data } = await this.validator.validate(input);

    const company = await this.findCompany(userId);

    const vacancy = await this.vacancyRepository.create({
      ...data,
      ...this.buildBaseData(company.id),
    });

    return vacancy;
  }

  private buildBaseData(companyId: string) {
    const currentTime = new Date();

    return {
      id: randomUUID(),
      companyId,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private async findCompany(userId: string) {
    const company = await this.companyRepository.findBy({ userId });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    return company;
  }
}

export namespace CreateVacancyUseCase {
  export type Input = {
    userId: string;
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