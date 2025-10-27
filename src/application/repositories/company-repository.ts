import { Company } from '@/domain';

export namespace CompanyRepository {
  export namespace Create {
    export type Input = Company;
    export type Output = Company;
  }

  export namespace FindBy {
    export type Input = Partial<{
      document: string;
      userId: string;
      id: string;
    }>

    export type Output = Company | null;
  }
}

export interface CompanyRepository {
  create(input: CompanyRepository.Create.Input): Promise<CompanyRepository.Create.Output>;
  findBy(input: CompanyRepository.FindBy.Input): Promise<CompanyRepository.FindBy.Output>;
}