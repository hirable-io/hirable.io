import { Company } from '@/domain';

export namespace CompanyRepository {
  export namespace Create {
    export type Input = Company;
    export type Output = Company;
  }
}

export interface CompanyRepository {
  create(input: CompanyRepository.Create.Input): Promise<CompanyRepository.Create.Output>;
}