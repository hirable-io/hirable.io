import { CandidateRepository } from '@/application/repositories';
import { DataSource,Repository } from 'typeorm';
import { CandidateEntity, CandidateSchema } from '../entities';

export class CandidateTypeOrmRepository implements CandidateRepository {
  private readonly repository: Repository<CandidateSchema>;
  constructor(
    private readonly datasource: DataSource,
  ) {
    this.repository = this.datasource.getRepository(CandidateEntity);
  }

  async create(input: CandidateRepository.Create.Input): Promise<CandidateRepository.Create.Output> {
    const candidate = this.repository.create(input);
    await this.repository.save(candidate);

    return candidate;
  }
}