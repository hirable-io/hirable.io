import { CreateAccountZodValidator } from '@/infra/services/shared/zod/create-account-zod-validator';
import { ServicesDI } from './services';
import { CreateAccountUseCase, LoginUsecase, UploadImageUseCase } from '@/application/usecases/account';
import { UpdateCandidateUseCase, UploadResumeUseCase } from '@/application/usecases/candidate';
import { CreateVacancyZodValidator, DeleteVacancyZodValidator, ListCompanyVacancyZodValidator, LoginZodValidator, UpdateCandidateZodValidator, UploadImageZodValidator, UploadResumeZodValidator } from '@/infra/services/shared/zod';
import { CreateVacancyUseCase, DeleteVacancyUseCase, UpdateVacancyUseCase, ListCompanyVacancyUseCase } from '@/application/usecases/company';
import { UpdateVacancyZodValidator } from '@/infra/services/shared/zod/update-vacancy-zod-validator';
import { ListTagsUsecase } from '@/application/usecases/tags';

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
    ))
    .add('LoginUsecase', ({
      JWTService,
      HashingService,
      UserRepository,
    }) => new LoginUsecase(
      new LoginZodValidator(),
      UserRepository,
      HashingService,
      JWTService,
    ))
    .add('UploadImageUseCase', ({
      StorageService,
      UserRepository,
    }) => new UploadImageUseCase(
      new UploadImageZodValidator(),
      UserRepository,
      StorageService,
    ))
    .add('UploadResumeUseCase', ({
      CandidateRepository,
      StorageService,
    }) => new UploadResumeUseCase(
      new UploadResumeZodValidator(),
      CandidateRepository,
      StorageService,
    ))
    .add('UpdateCandidateUseCase', ({
      CandidateRepository,
    }) => new UpdateCandidateUseCase(
      new UpdateCandidateZodValidator(),
      CandidateRepository,
    ))
    .add('CreateVacancyUseCase', ({
      CompanyRepository,
      VacancyRepository,
    }) => new CreateVacancyUseCase(
      new CreateVacancyZodValidator(),
      CompanyRepository,
      VacancyRepository,
    ))
    .add('DeleteVacancyUseCase', ({
      CompanyRepository,
      VacancyRepository,
    }) => new DeleteVacancyUseCase(
      new DeleteVacancyZodValidator(),
      CompanyRepository,
      VacancyRepository,
    ))
    .add('UpdateVacancyUseCase', ({
      CompanyRepository,
      VacancyRepository,
    }) => new UpdateVacancyUseCase(
      new UpdateVacancyZodValidator(),
      CompanyRepository,
      VacancyRepository,
    ))
    .add('ListCompanyVacancyUseCase', ({
      CompanyRepository,
      VacancyRepository,
    }) => new ListCompanyVacancyUseCase(
      new ListCompanyVacancyZodValidator(),
      CompanyRepository,
      VacancyRepository,
    ))
    .add('ListTagsUsecase', ({
      TagRepository,
    }) => new ListTagsUsecase(
      TagRepository,
    ));
}

export type UseCasesDI = ReturnType<typeof configureUseCases>;
