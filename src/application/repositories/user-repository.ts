import { User } from '@/domain';

export namespace UserRepository {
  export namespace Create {
    export type Input = User;
    export type Output = User;
  }
}

export interface UserRepository {
  create(input: UserRepository.Create.Input): Promise<UserRepository.Create.Output>;
}