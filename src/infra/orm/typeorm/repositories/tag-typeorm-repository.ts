import { TagRepository } from '@/application/repositories';
import { DataSource, Repository } from 'typeorm';
import { TagSchema, TagEntity } from '../entities';

export class TagTypeOrmRepository implements TagRepository {
  private readonly repository: Repository<TagSchema>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(TagEntity);
  }

  async list(): Promise<TagRepository.List.Output> {
    const tags = await this.repository.find();

    return tags;
  }
}