import { describe, expect, test } from 'vitest';
import { faker } from '@faker-js/faker';
import { UploadResumeZodValidator } from '@/infra/services/shared/zod';
import { ValidationError } from '@/application/errors';

describe('UploadResumeZodValidator', () => {
  const validator = new UploadResumeZodValidator();

  const validCases = [
    {
      input: {
        userId: faker.string.uuid(),
        file: Buffer.from(faker.lorem.paragraphs(1)),
        mimeType: 'application/pdf',
      },
      description: 'valid input',
    },
  ];

  test.each(validCases)('should pass validation for $description', async ({ input }) => {
    await expect(validator.validate(input)).resolves.toStrictEqual(input);
  });

  const invalidCases = [
    {
      input: {
        userId: 'invalid-uuid',
        file: Buffer.from(faker.lorem.paragraphs(1)),
        mimeType: 'application/pdf',
      },
      description: 'invalid userId',
    },
    {
      input: {
        userId: faker.string.uuid(),
        file: Buffer.from(''),
        mimeType: 'application/pdf',
      },
      description: 'empty file buffer',
    },
    {
      input: {
        userId: faker.string.uuid(),
        file: 'not-a-buffer',
        mimeType: 'application/pdf',
      },
      description: 'file is not a buffer',
    },
    {
      input: {
        userId: faker.string.uuid(),
        file: Buffer.from(faker.lorem.paragraphs(1)),
        mimeType: 'text/plain',
      },
      description: 'invalid mimeType',
    },
  ];

  test.each(invalidCases)('should throw ValidationError for $description', async ({ input }) => {
    await expect(validator.validate(input)).rejects.toBeInstanceOf(ValidationError);
  });
});
