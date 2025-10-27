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

  async findBy(input: CompanyRepository.FindBy.Input): Promise<CompanyRepository.FindBy.Output> {
    const queryBuilder = this.repository.createQueryBuilder('company');

    if (input.document) {
      queryBuilder.andWhere('company.document = :document', { document: input.document });
    }

    if (input.id) {
      queryBuilder.andWhere('company.id = :id', { id: input.id });
    }

    if (input.userId) {
      queryBuilder.andWhere('company.userId = :userId', { userId: input.userId });
    }

    const company = await queryBuilder.getOne();

    return company;
  }
}