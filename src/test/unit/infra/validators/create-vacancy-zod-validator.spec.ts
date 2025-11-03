import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { CreateVacancyZodValidator } from '@/infra/services/shared/zod';
import { ValidationError } from '@/application/errors';

describe('CreateVacancyZodValidator', () => {
  const validator = new CreateVacancyZodValidator();

  const validCases = [
    {
      input: {
        userId: faker.string.uuid(),
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.sentence(10),
          location: faker.location.city(),
          minimumSalaryValue: faker.number.int({ min: 3000, max: 8000 }),
          maximumSalaryValue: faker.number.int({ min: 9000, max: 15000 }),
          status: 'OPEN',
          modality: 'REMOTE',
          tags: [
            { id: faker.number.int({ min: 1, max: 10 }), name: faker.word.sample() },
            { id: faker.number.int({ min: 1, max: 10 }), name: faker.word.sample() },
          ],
        },
      },
      description: 'valid vacancy with tags',
    },
    {
      input: {
        userId: faker.string.uuid(),
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.sentence(12),
          location: faker.location.city(),
          minimumSalaryValue: faker.number.int({ min: 2000, max: 4000 }),
          maximumSalaryValue: faker.number.int({ min: 5000, max: 8000 }),
          status: 'OPEN',
          modality: 'ONSITE',
        },
      },
      description: 'valid vacancy without tags',
    },
  ];

  test.each(validCases)('should pass validation for $description', async ({ input }) => {
    await expect(validator.validate(input)).resolves.toEqual(input);
  });

  const invalidCases = [
    {
      input: {
        userId: 'invalid-uuid',
        data: {
          title: faker.word.sample(3),
          description: faker.lorem.words(2),
          location: faker.location.city().slice(0, 1),
          minimumSalaryValue: -1,
          maximumSalaryValue: -100,
          status: 'OPEN',
          modality: 'REMOTE',
        },
      },
      description: 'invalid UUID and invalid data fields',
    },
    {
      input: {
        userId: faker.string.uuid(),
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.sentence(10),
          location: faker.location.city(),
          minimumSalaryValue: faker.number.int({ min: 1000, max: 2000 }),
          maximumSalaryValue: faker.number.int({ min: 3000, max: 5000 }),
          status: 'INVALID_STATUS' as any,
          modality: 'REMOTE',
        },
      },
      description: 'invalid status enum',
    },
    {
      input: {
        userId: faker.string.uuid(),
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.sentence(10),
          location: faker.location.city(),
          minimumSalaryValue: faker.number.int({ min: 1000, max: 2000 }),
          maximumSalaryValue: faker.number.int({ min: 3000, max: 5000 }),
          status: 'OPEN',
          modality: 'INVALID_MODALITY' as any,
        },
      },
      description: 'invalid modality enum',
    },
    {
      input: {
        userId: faker.string.uuid(),
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.sentence(10),
          location: faker.location.city(),
          minimumSalaryValue: faker.number.int({ min: 1000, max: 2000 }),
          maximumSalaryValue: faker.number.int({ min: 3000, max: 5000 }),
          status: 'OPEN',
          modality: 'REMOTE',
          tags: [{ id: -1, name: 'A' }],
        },
      },
      description: 'invalid tags',
    },
  ];

  test.each(invalidCases)('should throw ValidationError for $description', async ({ input }) => {
    await expect(validator.validate(input)).rejects.toBeInstanceOf(ValidationError);
  });
});
