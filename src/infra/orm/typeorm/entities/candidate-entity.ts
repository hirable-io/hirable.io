import { EntitySchema } from 'typeorm';
import { Candidate, User } from '@/domain';
import { BaseEntity } from './base-entity';

export type CandidateSchema = Candidate & {
  user?: User,
};

export const CandidateEntity = new EntitySchema<CandidateSchema>({
  name: 'candidates',
  columns: {
    ...BaseEntity,
    fullName: {
      name: 'full_name',
      type: 'varchar',
    },
    bio: {
      name: 'bio',
      type: 'text',
    },
    resumeUrl: {
      name: 'resume_url',
      type: 'varchar',
      nullable: true,
    },
    phone: {
      name: 'phone',
      type: 'varchar',
    },
    linkedInUrl: {
      name: 'linkedin_url',
      type: 'varchar',
      nullable: true,
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
      inverseSide: 'candidate',
    },
    tags: {
      type: 'many-to-many',
      target: 'tags',
      joinTable: {
        name: 'candidates_tags',
        joinColumn: { name: 'candidate_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
      },
    },
  }
});