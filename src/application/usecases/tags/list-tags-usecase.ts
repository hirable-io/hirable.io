import { TagRepository } from '@/application/repositories';
import { Tag } from '@/domain';

export class ListTagsUsecase {
  constructor(
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(input: ListTagsUsecase.Input): Promise<ListTagsUsecase.Output> {
    return this.tagRepository.list(input);
  }
}

export namespace ListTagsUsecase {
  export type Input = void;
  export type Output = Array<Tag>;
}