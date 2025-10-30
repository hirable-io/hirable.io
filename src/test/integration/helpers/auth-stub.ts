import { vi } from 'vitest';
import { container } from '@/infra/container';
import { Role, Roles } from '@/domain';
import { faker } from '@faker-js/faker';

export type MockUser = {
  userId?: string;
  email?: string;
  role?: Role;
  [key: string]: any;
};

export function mockAuth(
  user: MockUser,
) {
  const jwtService = container.get('JWTService');

  const verifySpy = vi.spyOn(jwtService, 'verify').mockImplementation(async () => {
    return {
      userId: user.userId ?? faker.string.uuid(),
      email: user.email ?? faker.internet.email(),
      role: user.role ?? Roles.EMPLOYER,
    };
  });

  return {
    restore: () => verifySpy.mockRestore(),
    spy: verifySpy,
  };
}