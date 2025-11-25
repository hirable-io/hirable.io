import { NotFoundError } from '@/application/errors';
import { CandidateRepository, VacancyRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { Modality, Vacancy } from '@/domain';

export class ListVacanciesUseCase {
  constructor(
    private readonly validator: Validator<ListVacanciesUseCase.Input>,
    private readonly candidateRepository: CandidateRepository,
    private readonly vacancyRepository: VacancyRepository,
  ) {}

  async execute(input: ListVacanciesUseCase.Input): Promise<ListVacanciesUseCase.Output> {
  const { userId, limit, offset, modality } = await this.validator.validate(input);

    const candidate = await this.candidateRepository.findBy({ userId });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    const pagination = { limit, offset };

    return this.vacancyRepository.listAvailable({
      ...pagination,
      candidateId: candidate.id,
      modality,
    });
  }
}

export namespace ListVacanciesUseCase {
  export type Input = {
    limit?: number;
    offset?: number;
    modality?: Modality;
    userId: string;
  };

  export type Filter = VacancyRepository.List.Filter;

  export type Output = {
    vacancies: Array<Vacancy>;
    total: number;
  };

}