import { Candidate, Company, User } from '@/domain';
import { EntitySchema } from 'typeorm';

export type UserSchema = User & {
  company?: Company,
  candidate?: Candidate,
};

export const UserEntity = new EntitySchema<UserSchema>({
  name: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      name: 'email',
      type: 'varchar',
      unique: true,
    },
    passwordHash: {
      name: 'password_hash',
      type: 'varchar',
    },
    role: {
      name: 'role',
      type: 'varchar',
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
    },
    imageUrl: {
      name: 'image_url',
      type: 'varchar',
      nullable: true,
    },
  },
  relations: {
    company: {
      type: 'one-to-one',
      target: 'companies',
      inverseSide: 'user',
    },
    candidate: {
      type: 'one-to-one',
      target: 'candidates',
      inverseSide: 'user',
    },
  }
});