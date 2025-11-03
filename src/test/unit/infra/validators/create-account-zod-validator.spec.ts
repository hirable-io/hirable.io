import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { cnpj } from 'cpf-cnpj-validator';
import { CreateAccountZodValidator } from '@/infra/services/shared/zod';
import { ValidationError } from '@/application/errors/validation-error';
import { Roles } from '@/domain';

describe('CreateAccountZodValidator', () => {
  const validator = new CreateAccountZodValidator();

  const validCases = [
    {
      input: {
        user: {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8 }),
          role: Roles.CANDIDATE,
        },
        candidate: {
          fullName: faker.person.fullName(),
          phone: faker.phone.number(),
        },
      },
      description: 'valid candidate',
    },
    {
      input: {
        user: {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8 }),
          role: Roles.EMPLOYER,
        },
        company: {
          name: faker.company.name(),
          document: cnpj.generate(),
          contactName: faker.person.fullName(),
          phone: faker.phone.number(),
        },
      },
      description: 'valid employer',
    },
  ];

  test.each(validCases)('should pass validation for $description', async ({ input }) => {
    await expect(validator.validate(input)).resolves.toEqual({
      ...input,
      candidate: input.candidate
        ? {
            ...input.candidate,
            bio: '',
            phone: input.candidate.phone.replace(/\D/g, ''),
          }
        : undefined,
      company: input.company
        ? {
            ...input.company,
            phone: input.company.phone.replace(/\D/g, ''),
          }
        : undefined,
    });
  });

  const invalidCases = [
    {
      input: {
        user: {
          email: 'invalid-email',
          password: faker.internet.password({ length: 3 }),
          role: Roles.CANDIDATE,
        },
        candidate: {
          fullName: 'Jo',
          phone: '',
        },
      },
      description: 'invalid candidate email and fullName too short',
    },
    {
      input: {
        user: {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8 }),
          role: Roles.EMPLOYER,
        },
      },
      description: 'missing company for employer',
    },
    {
      input: {
        user: {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8 }),
          role: Roles.CANDIDATE,
        },
      },
      description: 'missing candidate for candidate role',
    },
    {
      input: {
        user: {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8 }),
          role: Roles.EMPLOYER,
        },
        candidate: {
          fullName: faker.person.fullName(),
          phone: faker.phone.number(),
        },
      },
      description: 'candidate data not allowed for employer',
    },
    {
      input: {
        user: {
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8 }),
          role: Roles.CANDIDATE,
        },
        company: {
          name: faker.company.name(),
          document: cnpj.generate(),
          contactName: faker.person.fullName(),
          phone: faker.phone.number(),
        },
      },
      description: 'company data not allowed for candidate',
    },
  ];

  test.each(invalidCases)('should throw ValidationError for $description', async ({ input }) => {
    await expect(validator.validate(input)).rejects.toBeInstanceOf(ValidationError);
  });
});
