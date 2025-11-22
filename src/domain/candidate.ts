import { Tag, User } from '@/domain';

export type Candidate = {
  id: string;
  userId: string;
  user?: User;
  fullName: string;
  bio: string;
  phone: string;
  resumeUrl?: string | null;
  linkedInUrl?: string;
  imageUrl?: string | null;
  tags: Array<Tag>;
  createdAt: Date;
  updatedAt: Date;
};