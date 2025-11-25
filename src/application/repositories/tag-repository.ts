import { Tag } from '@/domain';

export namespace TagRepository {
  export namespace List {
    export type Input = void;
    export type Output = Array<Tag>;
  }
}

export interface TagRepository {
  list(input: TagRepository.List.Input): Promise<TagRepository.List.Output>;
}