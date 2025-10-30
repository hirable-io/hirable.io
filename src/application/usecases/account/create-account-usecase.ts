import { AlreadyExistsError } from '@/application/errors';
import { CandidateRepository, CompanyRepository, UserRepository } from '@/application/repositories';
import { HashingService, Validator } from '@/application/services';
import { Roles } from '@/domain';
import { randomUUID } from 'node:crypto';

export class CreateAccountUseCase {
  constructor(
    private readonly validator: Validator<CreateAccountUseCase.Input>,
    private readonly hashingService: HashingService,
    private readonly userRepository: UserRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(data: CreateAccountUseCase.Input): Promise<CreateAccountUseCase.Output> {
    const validatedData = await this.validator.validate(data);
    await this.checkUserAlreadyExists(validatedData);

    const now = new Date();

    const user = await this.createUser(validatedData, now);

    const candidate =
      validatedData.candidate && user.role === Roles.CANDIDATE
        ? await this.createCandidate(user.id, validatedData.candidate, now)
        : undefined;

    const company =
      validatedData.company && user.role === Roles.EMPLOYER
        ? await this.createCompany(user.id, validatedData.company, now)
        : undefined;

    return { user, candidate, company };
  }

  private async createUser(
    data: CreateAccountUseCase.Input,
    now: Date,
  ): Promise<CreateAccountUseCase.UserOutput> {
    const passwordHash = await this.hashingService.hash(data.user.password);

    const user = await this.userRepository.create({
      id: randomUUID(),
      email: data.user.email,
      passwordHash,
      role: data.user.role,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  private async createCandidate(
    userId: string,
    data: CreateAccountUseCase.Input['candidate'],
    now: Date,
  ): Promise<CreateAccountUseCase.CandidateOutput> {
    const candidate = await this.candidateRepository.create({
      id: randomUUID(),
      userId,
      fullName: data!.fullName,
      bio: data!.bio,
      phone: data!.phone,
      tags: [],
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: candidate.id,
      fullName: candidate.fullName,
      phone: candidate.phone,
      bio: candidate.bio,
      tags: candidate.tags.map(tag => ({ id: tag.id, name: tag.name })),
    };
  }

  private async createCompany(
    userId: string,
    data: CreateAccountUseCase.Input['company'],
    now: Date,
  ): Promise<CreateAccountUseCase.CompanyOutput> {
    const company = await this.companyRepository.create({
      id: randomUUID(),
      userId,
      name: data!.name,
      document: data!.document,
      contactName: data!.contactName,
      phone: data!.phone,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: company.id,
      name: company.name,
      document: company.document,
      contactName: company.contactName,
      phone: company.phone,
    };
  }

  private async checkUserAlreadyExists(input: CreateAccountUseCase.Input): Promise<void> {
    const user = await this.userRepository.findBy({ email: input.user.email });

    if (user) {
      throw new AlreadyExistsError('User with this email already exists');
    }

    if (!input.company) {
      return;
    }

    const company = await this.companyRepository.findBy({ document: input.company.document });

    if (company) {
      throw new AlreadyExistsError('Company with this document already exists');
    }
  }
}

export namespace CreateAccountUseCase {
  export type Input = {
    user: {
      email: string;
      password: string;
      role: typeof Roles.CANDIDATE | typeof Roles.EMPLOYER;
    };
    candidate?: {
      fullName: string;
      bio: string;
      phone: string;
    };
    company?: {
      name: string;
      document: string;
      contactName: string;
      phone: string;
    };
  };

  export type UserOutput = {
    id: string;
    email: string;
    role: string;
  };

  export type CandidateOutput = {
    id: string;
    fullName: string;
    bio: string;
    phone: string;
    tags: Array<{ id: number; name: string }>;
  };

  export type CompanyOutput = {
    id: string;
    name: string;
    document: string;
    contactName: string;
    phone: string;
  };

  export type Output = {
    user: UserOutput;
    candidate?: CandidateOutput;
    company?: CompanyOutput;
  };
}
