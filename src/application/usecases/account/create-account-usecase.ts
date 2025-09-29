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

    const passwordHash = await this.hashingService.hash(validatedData.user.password);
    
    const user = await this.userRepository.create({
      id: randomUUID(),
      email: validatedData.user.email,
      passwordHash,
      role: validatedData.user.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: validatedData.user.phone,
    });

    if (validatedData.candidate) {
      await this.candidateRepository.create({
        id: randomUUID(),
        userId: user.id,
        fullName: validatedData.candidate.fullName,
        bio: validatedData.candidate.bio,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  
    if (validatedData.company) {
      await this.companyRepository.create({
        id: randomUUID(),
        userId: user.id,
        name: validatedData.company.name,
        document: validatedData.company.document,
        contactName: validatedData.company.contactName,
        phone: validatedData.company.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return;
  }
}

export namespace CreateAccountUseCase {
  export type Input = {
    user: {
      email: string;
      phone: string;
      password: string;
      role: typeof Roles.CANDIDATE | typeof Roles.EMPLOYER;
    };
    candidate?: {
      fullName: string;
      bio: string;
    };
    company?: {
      name: string;
      document: string;
      contactName: string;
      phone: string;
    };
  };

  export type Output = void;
}