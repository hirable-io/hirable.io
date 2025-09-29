export const Roles = {
  ADMIN: 'ADMIN',
  CANDIDATE: 'CANDIDATE',
  EMPLOYER: 'EMPLOYER',
} as const;

export type Role = keyof typeof Roles;

export type User = {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};