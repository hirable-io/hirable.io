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

  async findBy(input: UserRepository.FindBy.Input): Promise<UserRepository.FindBy.Output> {
    const queryBuilder = this.repository.createQueryBuilder('user');

    if (input.email) {
      queryBuilder.andWhere('user.email = :email', { email: input.email });
    }

    if (input.id) {
      queryBuilder.andWhere('user.id = :id', { id: input.id });
    }

    const user = await queryBuilder.getOne();

    return user;
  }

  async update(id: string, input: UserRepository.Update.Input): Promise<UserRepository.Update.Output> {
    const user = await this.repository.findOneBy({ id });
    
    if (!user) {
      return null;
    }

    const updatedUser = await this.repository.save({
      ...user,
      ...input,
    });

    return updatedUser;
  }
}