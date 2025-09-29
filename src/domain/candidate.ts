import { Tag, User } from '@/domain';

export type Candidate = {
  id: string;
  userId: string;
  user?: User;
  fullName: string;
  bio: string;
  resumeUrl?: string;
  tags: Array<Tag>;
  createdAt: Date;
  updatedAt: Date;
}