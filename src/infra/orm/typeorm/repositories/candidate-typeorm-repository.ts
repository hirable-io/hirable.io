import { CandidateRepository } from '@/application/repositories';
import { DataSource, In, Repository } from 'typeorm';
import { CandidateEntity, CandidateSchema, TagEntity } from '../entities';

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

  async findBy(
    input: CandidateRepository.FindBy.Input,
    relations?: CandidateRepository.FindBy.Relations,
  ): Promise<CandidateRepository.FindBy.Output> {
    const queryBuilder = this.repository.createQueryBuilder('candidate');

    if (input.id) {
      queryBuilder.andWhere('candidate.id = :id', { id: input.id });
    }
    
    if (input.userId) {
      queryBuilder.andWhere('candidate.userId = :userId', { userId: input.userId });
    }

    if (relations?.user) {
      queryBuilder.leftJoinAndSelect('candidate.user', 'user');
    }

    queryBuilder.leftJoinAndSelect('candidate.tags', 'tags');

    const candidate = await queryBuilder.getOne();

    return candidate;
  }

  async update(id: string, input: CandidateRepository.Update.Input): Promise<CandidateRepository.Update.Output> {
    const candidate = await this.repository.findOne({
      where: { id },
      relations: { tags: true },
    });

    if (!candidate) {
      return null;
    }

    if (input.tags) {
      const tagRepository = this.datasource.getRepository(TagEntity);
      const tagsIds = input.tags.map(tag => tag.id);
      const tags = await tagRepository.find({ where: { id: In(tagsIds) } });

      candidate.tags = tags;
      delete input.tags;
    }

    const updatedCandidate = await this.repository.save({
      ...candidate,
      ...input,
    });

    return updatedCandidate;
  }
}