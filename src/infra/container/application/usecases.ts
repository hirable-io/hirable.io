import { CreateAccountZodValidator } from '@/infra/services/shared/zod/create-account-zod-validator';
import { ServicesDI } from './services';
import { CreateAccountUseCase } from '@/application/usecases/account';

export function configureUseCases(container: ServicesDI) {
  return container
    .add('CreateAccountUseCase', ({
      HashingService,
      UserRepository,
      CandidateRepository,
      CompanyRepository,
    }) => new CreateAccountUseCase(
      new CreateAccountZodValidator(),
      HashingService,
      UserRepository,
      CandidateRepository,
      CompanyRepository,
    ));
}

export type UseCasesDI = ReturnType<typeof configureUseCases>;
