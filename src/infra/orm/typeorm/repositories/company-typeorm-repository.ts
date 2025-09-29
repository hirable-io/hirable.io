import { CompanyRepository } from '@/application/repositories';
import { CompanyEntity, CompanySchema } from '../entities';
import { DataSource, Repository } from 'typeorm';

export class CompanyTypeOrmRepository implements CompanyRepository {
  private readonly repository: Repository<CompanySchema>;
  constructor(
    private readonly datasource: DataSource,
  ) {
    this.repository = this.datasource.getRepository(CompanyEntity);
  }

  async create(input: CompanyRepository.Create.Input): Promise<CompanyRepository.Create.Output> {
    const company = this.repository.create(input);
    await this.repository.save(company);

    return company;
  }
}