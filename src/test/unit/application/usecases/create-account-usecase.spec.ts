import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Roles } from '@/domain';
import { AlreadyExistsError } from '@/application/errors';
import { CreateAccountUseCase } from '@/application/usecases/account';

describe('CreateAccountUseCase', () => {
  let validator: any;
  let hashingService: any;
  let userRepository: any;
  let candidateRepository: any;
  let companyRepository: any;
  let usecase: CreateAccountUseCase;

  beforeEach(() => {
    validator = { validate: vi.fn() };
    hashingService = { hash: vi.fn() };
    userRepository = { create: vi.fn(), findBy: vi.fn() };
    candidateRepository = { create: vi.fn() };
    companyRepository = { create: vi.fn(), findBy: vi.fn() };

    usecase = new CreateAccountUseCase(
      validator,
      hashingService,
      userRepository,
      candidateRepository,
      companyRepository,
    );
  });

  it('creates a candidate successfully', async () => {
    const input = {
      user: { email: 'candidate@example.com', password: '123', role: Roles.CANDIDATE },
      candidate: { fullName: 'John Doe', bio: 'Bio', phone: '11999999999' },
    };

    validator.validate.mockResolvedValue(input);
    hashingService.hash.mockResolvedValue('hashed-password');
    userRepository.findBy.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({ id: 'user-id', email: input.user.email, role: Roles.CANDIDATE });
    candidateRepository.create.mockResolvedValue({
      id: 'candidate-id',
      userId: 'user-id',
      fullName: input.candidate.fullName,
      bio: input.candidate.bio,
      phone: input.candidate.phone,
      tags: [],
    });

    const result = await usecase.execute(input);

    expect(result.user).toEqual({ id: 'user-id', email: input.user.email, role: Roles.CANDIDATE });
    expect(result.candidate).toEqual({
      id: 'candidate-id',
      fullName: input.candidate.fullName,
      bio: input.candidate.bio,
      phone: input.candidate.phone,
      tags: [],
    });
    expect(result.company).toBeUndefined();
  });

  it('throws if user email already exists', async () => {
    const input = { user: { email: 'exists@example.com', password: '123', role: Roles.CANDIDATE } };
    validator.validate.mockResolvedValue(input);
    userRepository.findBy.mockResolvedValue({ id: 'user-id', email: input.user.email });

    await expect(usecase.execute(input)).rejects.toBeInstanceOf(AlreadyExistsError);
  });

  it('creates an employer with company successfully', async () => {
    const input = {
      user: { email: 'employer@example.com', password: '123', role: Roles.EMPLOYER },
      company: { name: 'Acme', document: '12.345.678/0001-95', contactName: 'Alice', phone: '11988888888' },
    };

    validator.validate.mockResolvedValue(input);
    hashingService.hash.mockResolvedValue('hashed-password');
    userRepository.findBy.mockResolvedValue(null);
    companyRepository.findBy.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({ id: 'user-id', email: input.user.email, role: Roles.EMPLOYER });
    companyRepository.create.mockResolvedValue({
      id: 'company-id',
      userId: 'user-id',
      name: input.company.name,
      document: input.company.document,
      contactName: input.company.contactName,
      phone: input.company.phone,
    });

    const result = await usecase.execute(input);

    expect(result.user).toEqual({ id: 'user-id', email: input.user.email, role: Roles.EMPLOYER });
    expect(result.company).toEqual({
      id: 'company-id',
      name: input.company.name,
      document: input.company.document,
      contactName: input.company.contactName,
      phone: input.company.phone,
    });
    expect(result.candidate).toBeUndefined();
  });

  it('throws if company document already exists', async () => {
    const input = {
      user: { email: 'employer@example.com', password: '123', role: Roles.EMPLOYER },
      company: { name: 'Acme', document: '12.345.678/0001-95', contactName: 'Alice', phone: '11988888888' },
    };

    validator.validate.mockResolvedValue(input);
    userRepository.findBy.mockResolvedValue(null);
    companyRepository.findBy.mockResolvedValue({ id: 'company-id', document: input.company.document });

    await expect(usecase.execute(input)).rejects.toBeInstanceOf(AlreadyExistsError);
  });
});
