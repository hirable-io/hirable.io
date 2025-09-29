import { Tag } from '@/domain';
import { EntitySchema } from 'typeorm';

export type TagSchema = Tag;

export const TagEntity = new EntitySchema<TagSchema>({
  name: 'tags',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: 'increment',
    },
    name: {
      type: 'varchar',
      length: 100,
      unique: true,
    },
  },
});