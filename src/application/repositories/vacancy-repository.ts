import { Vacancy } from '@/domain';

export namespace VacancyRepository {
  export namespace Create {
    export type Input = Vacancy;
    export type Output = Vacancy;
  }

  export namespace FindBy {
    export type Input = {
      id: string;
    };

    export type Output = Vacancy | null;
  }

  export namespace FindMany {
    export type Input = {
      companyId: string;
      limit?: number;
      offset?: number;
    };

    export type Output = {
      vacancies: Vacancy[];
      total: number;
    };
  }

  export namespace List {
    export type Input = {
      limit?: number;
      offset?: number;
    };

    export type Filter = Partial<{
      modality: Vacancy['modality'];
      companyId: string;
    }>;

    export type Output = Vacancy[];
  }

  export namespace Update {
    export type Input = Partial<Omit<Vacancy, 'id' | 'createdAt' | 'companyId'>>;
    export type Output = Vacancy | null;
  }

  export namespace Delete {
    export type Input = {
      id: string;
    };

    export type Output = void;
  }
}

export interface VacancyRepository {
  create(
    input: VacancyRepository.Create.Input,
  ): Promise<VacancyRepository.Create.Output>;
  findBy(
    input: VacancyRepository.FindBy.Input,
  ): Promise<VacancyRepository.FindBy.Output>;
  list(
    filter: VacancyRepository.List.Filter,
    input: VacancyRepository.List.Input
  ): Promise<VacancyRepository.List.Output>;
  update(
    id: string,
    input: VacancyRepository.Update.Input
  ): Promise<VacancyRepository.Update.Output>;
  delete(
    input: VacancyRepository.Delete.Input,
  ): Promise<VacancyRepository.Delete.Output>;
  findMany(
    input: VacancyRepository.FindMany.Input,
  ): Promise<VacancyRepository.FindMany.Output>;
}