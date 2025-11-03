import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/application/errors';
import { CreateVacancyUseCase } from '@/application/usecases/company';
import { Modalities, VacancyStatuses } from '@/domain';


describe('CreateVacancyUseCase', () => {
  let validator: any;
  let companyRepository: any;
  let vacancyRepository: any;
  let usecase: CreateVacancyUseCase;

  beforeEach(() => {
    validator = { validate: vi.fn() };
    companyRepository = { findBy: vi.fn() };
    vacancyRepository = { create: vi.fn() };

    usecase = new CreateVacancyUseCase(validator, companyRepository, vacancyRepository);
  });

  it('creates a vacancy successfully', async () => {
    const userId = faker.string.uuid();
    const companyId = faker.string.uuid();

    const input = {
      userId,
      data: {
        title: faker.person.jobTitle(),
        description: faker.lorem.paragraph(),
        location: faker.location.city(),
        minimumSalaryValue: faker.number.int({ min: 2000, max: 4000 }),
        maximumSalaryValue: faker.number.int({ min: 5000, max: 8000 }),
        status: VacancyStatuses.OPEN,
        modality: Modalities.REMOTE,
        tags: [
          { id: parseInt(faker.string.numeric(5)), name: faker.word.noun() },
          { id: parseInt(faker.string.numeric(5)), name: faker.word.noun() },
        ],
      },
    };

    const validatedInput = { ...input };
    const existingCompany = { id: companyId, userId, name: faker.company.name() };

    const createdVacancy = {
      id: faker.string.uuid(),
      companyId,
      ...input.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    validator.validate.mockResolvedValue(validatedInput);
    companyRepository.findBy.mockResolvedValue(existingCompany);
    vacancyRepository.create.mockResolvedValue(createdVacancy);

    const result = await usecase.execute(input);

    expect(validator.validate).toHaveBeenCalledWith(input);
    expect(companyRepository.findBy).toHaveBeenCalledWith({ userId });
    expect(vacancyRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...input.data,
        companyId,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );

    expect(result).toEqual(createdVacancy);
  });

  it('throws NotFoundError if company is not found', async () => {
    const userId = faker.string.uuid();
    const input = {
      userId,
      data: {
        title: faker.person.jobTitle(),
        description: faker.lorem.sentence(),
        location: faker.location.city(),
        minimumSalaryValue: 3000,
        maximumSalaryValue: 6000,
        status: VacancyStatuses.OPEN,
        modality: Modalities.REMOTE,
      },
    };

    validator.validate.mockResolvedValue(input);
    companyRepository.findBy.mockResolvedValue(null);

    await expect(usecase.execute(input)).rejects.toBeInstanceOf(NotFoundError);
    expect(vacancyRepository.create).not.toHaveBeenCalled();
  });

  it('throws if vacancy creation fails unexpectedly', async () => {
    const userId = faker.string.uuid();
    const companyId = faker.string.uuid();

    const input = {
      userId,
      data: {
        title: faker.person.jobTitle(),
        description: faker.lorem.sentence(),
        location: faker.location.city(),
        minimumSalaryValue: 2500,
        maximumSalaryValue: 7000,
        status: VacancyStatuses.OPEN,
        modality: Modalities.REMOTE,
      },
    };

    const validatedInput = { ...input };
    const existingCompany = { id: companyId, userId };

    validator.validate.mockResolvedValue(validatedInput);
    companyRepository.findBy.mockResolvedValue(existingCompany);
    vacancyRepository.create.mockRejectedValue(new Error('Database error'));

    await expect(usecase.execute(input)).rejects.toThrow('Database error');
    expect(vacancyRepository.create).toHaveBeenCalledOnce();
  });
});
