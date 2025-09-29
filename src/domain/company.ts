import { User } from '@/domain';

export type Company = {
  id: string;
  name: string;
  document: string;
  contactName: string;
  phone: string
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
};