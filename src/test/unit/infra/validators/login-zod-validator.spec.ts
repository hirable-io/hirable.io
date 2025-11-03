import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { LoginZodValidator } from '@/infra/services/shared/zod';
import { ValidationError } from '@/application/errors';

describe('LoginZodValidator', () => {
  const validator = new LoginZodValidator();

  const validCases = [
    {
      input: { email: faker.internet.email(), password: faker.internet.password({ length: 8 }) },
      description: 'valid input',
    },
    {
      input: { email: faker.internet.email(), password: faker.internet.password({ length: 10 }) },
      description: 'another valid input',
    },
  ];

  test.each(validCases)('should pass validation for $description', async ({ input }) => {
    await expect(validator.validate(input)).resolves.toEqual(input);
  });

  const invalidCases = [
    {
      input: { email: 'invalid-email', password: faker.internet.password({ length: 3 }) },
      description: 'invalid email',
    },
    {
      input: { email: faker.internet.email(), password: '' },
      description: 'empty password',
    },
    {
      input: { email: '', password: '' },
      description: 'empty email and password',
    },
    {
      input: { password: faker.internet.password({ length: 8 }) },
      description: 'missing email',
    },
  ];

  test.each(invalidCases)('should throw ValidationError for $description', async ({ input }) => {
    await expect(validator.validate(input)).rejects.toBeInstanceOf(ValidationError);
  });
});
