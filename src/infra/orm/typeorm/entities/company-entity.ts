import { Company, User } from '@/domain';
import { EntitySchema } from 'typeorm';
import { BaseEntity } from './base-entity';

export type CompanySchema = Company & {
  user?: User,
}

export const CompanyEntity = new EntitySchema<CompanySchema>({
  name: 'companies',
  columns: {
    ...BaseEntity,
    name: {
      name: 'name',
      type: 'varchar',
    },
    document: {
      name: 'document',
      type: 'varchar',
      unique: true,
    },
    contactName: {
      name: 'contact_name',
      type: 'varchar',
    },
    phone: {
      name: 'phone',
      type: 'varchar',
    },
    userId: {
      name: 'user_id',
      type: 'uuid',
    },
  },
  relations: {
    user: {
      type: 'one-to-one',
      target: 'users',
      joinColumn: { name: 'user_id' },
      inverseSide: 'company',
    },
  },
});