import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundError } from '@/application/errors';
import { DeleteVacancyUseCase } from '@/application/usecases/company/delete-vacancy-usecase';
import { randomUUID } from 'node:crypto';

describe('DeleteVacancyUseCase', () => {
  let validator: any;
  let companyRepository: any;
  let vacancyRepository: any;
  let usecase: DeleteVacancyUseCase;

  beforeEach(() => {
    validator = { validate: vi.fn() };
    companyRepository = { findBy: vi.fn() };
    vacancyRepository = { findBy: vi.fn(), delete: vi.fn() };

    usecase = new DeleteVacancyUseCase(validator, companyRepository, vacancyRepository);
  });

  it('should delete a vacancy successfully', async () => {
    const userId = randomUUID();
    const vacancyId = randomUUID();

    validator.validate.mockResolvedValue({ userId, vacancyId });
    companyRepository.findBy.mockResolvedValue({ id: 'company-id', userId });
    vacancyRepository.findBy.mockResolvedValue({ id: vacancyId, companyId: 'company-id' });

    await expect(usecase.execute({ userId, vacancyId })).resolves.toBeUndefined();
    expect(vacancyRepository.delete).toHaveBeenCalledWith({ id: vacancyId });
  });

  it('should throw NotFoundError if company not found', async () => {
    const userId = randomUUID();
    const vacancyId = randomUUID();

    validator.validate.mockResolvedValue({ userId, vacancyId });
    companyRepository.findBy.mockResolvedValue(null);

    await expect(usecase.execute({ userId, vacancyId })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should throw NotFoundError if vacancy not found', async () => {
    const userId = randomUUID();
    const vacancyId = randomUUID();

    validator.validate.mockResolvedValue({ userId, vacancyId });
    companyRepository.findBy.mockResolvedValue({ id: 'company-id', userId });
    vacancyRepository.findBy.mockResolvedValue(null);

    await expect(usecase.execute({ userId, vacancyId })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should throw NotFoundError if vacancy does not belong to company', async () => {
    const userId = randomUUID();
    const vacancyId = randomUUID();

    validator.validate.mockResolvedValue({ userId, vacancyId });
    companyRepository.findBy.mockResolvedValue({ id: 'company-id', userId });
    vacancyRepository.findBy.mockResolvedValue({ id: vacancyId, companyId: 'other-company-id' });

    await expect(usecase.execute({ userId, vacancyId })).rejects.toBeInstanceOf(NotFoundError);
  });
});
