import { User } from '@/domain';

export namespace UserRepository {
  export namespace Create {
    export type Input = User;
    export type Output = User;
  }

  export namespace FindBy {
    export type Input = Partial<{
      email: string;
      id: string;
    }>

    export type Output = User | null;
  }

  export namespace Update {
    export type Input = Partial<Omit<User, 'id' |'createdAt' | 'email'>>;

    export type Output = User | null;
  }
}

export interface UserRepository {
  create(input: UserRepository.Create.Input): Promise<UserRepository.Create.Output>;
  findBy(input: UserRepository.FindBy.Input): Promise<UserRepository.FindBy.Output>;
  update(id: string, input: UserRepository.Update.Input): Promise<UserRepository.Update.Output>;
}