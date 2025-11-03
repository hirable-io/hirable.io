import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/application/errors';
import { UpdateCandidateUseCase } from '@/application/usecases/candidate';

describe('UpdateCandidateUseCase', () => {
  let validator: any;
  let candidateRepository: any;
  let usecase: UpdateCandidateUseCase;

  beforeEach(() => {
    validator = { validate: vi.fn() };
    candidateRepository = { findBy: vi.fn(), update: vi.fn() };

    usecase = new UpdateCandidateUseCase(validator, candidateRepository);
  });

  it('updates a candidate successfully', async () => {
    const userId = faker.string.uuid();
    const candidateId = faker.string.uuid();

    const input = {
      userId,
      data: {
        fullName: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        phone: faker.phone.number(),
      },
    };

    const validatedInput = { ...input };

    const existingCandidate = {
      id: candidateId,
      userId,
      fullName: faker.person.fullName(),
      bio: faker.lorem.sentence(),
      phone: faker.phone.number(),
      tags: [],
    };

    const updatedCandidate = {
      ...existingCandidate,
      ...input.data,
    };

    validator.validate.mockResolvedValue(validatedInput);
    candidateRepository.findBy.mockResolvedValue(existingCandidate);
    candidateRepository.update.mockResolvedValue(updatedCandidate);

    const result = await usecase.execute(input);

    expect(validator.validate).toHaveBeenCalledWith(input);
    expect(candidateRepository.findBy).toHaveBeenCalledWith({ userId });
    expect(candidateRepository.update).toHaveBeenCalledWith(candidateId, input.data);
    expect(result).toEqual(updatedCandidate);
  });

  it('throws NotFoundError if candidate does not exist', async () => {
    const userId = faker.string.uuid();
    const input = {
      userId,
      data: {
        fullName: faker.person.fullName(),
      },
    };

    validator.validate.mockResolvedValue(input);
    candidateRepository.findBy.mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(candidateRepository.update).not.toHaveBeenCalled();
  });
});
