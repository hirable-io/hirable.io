import { UserRepository } from '@/application/repositories';
import { DataSource } from 'typeorm';
import { UserEntity, UserSchema } from '@/infra/orm/typeorm/entities';
import { Repository } from 'typeorm';

export class UserTypeOrmRepository implements UserRepository {
  private readonly repository: Repository<UserSchema>;
  constructor(
    private readonly datasource: DataSource,
  ) {
    this.repository = this.datasource.getRepository(UserEntity);
  }

  async create(input: UserRepository.Create.Input): Promise<UserRepository.Create.Output> {
    const user = this.repository.create(input);
    await this.repository.save(user);

    return user;
  }
}