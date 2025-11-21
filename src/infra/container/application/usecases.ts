import { CreateAccountZodValidator } from '@/infra/services/shared/zod/create-account-zod-validator';
import { ServicesDI } from './services';
import { CreateAccountUseCase, LoginUsecase, UploadImageUseCase } from '@/application/usecases/account';
import { GetCandidateDataUseCase, ListVacanciesUseCase, UpdateCandidateUseCase, UploadResumeUseCase } from '@/application/usecases/candidate';
import { CreateJobApplicationZodValidator, CreateVacancyZodValidator, DeleteVacancyZodValidator, FetchCandidateApplicationsZodValidator, FetchVacancyApplicationsZodValidator, GetCandidateDataZodValidator, ListCompanyVacancyZodValidator, ListVacanciesZodValidator, LoginZodValidator, UpdateCandidateZodValidator, UpdateJobApplicationStatusZodValidator, UploadImageZodValidator, UploadResumeZodValidator } from '@/infra/services/shared/zod';
import { CreateVacancyUseCase, DeleteVacancyUseCase, UpdateVacancyUseCase, ListCompanyVacancyUseCase } from '@/application/usecases/company';
import { UpdateVacancyZodValidator } from '@/infra/services/shared/zod/update-vacancy-zod-validator';
import { ListTagsUsecase } from '@/application/usecases/tags';
import { CreateJobApplicationUseCase, FetchCandidateApplicationsUseCase, FetchVacancyApplicationsUseCase, UpdateJobApplicationStatusUseCase } from '@/application/usecases/job-application';

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
      CandidateRepository,
    }) => new UploadImageUseCase(
      new UploadImageZodValidator(),
      UserRepository,
      CandidateRepository,
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
    ))
    .add('CreateJobApplicationUseCase', ({
      VacancyRepository,
      CandidateRepository,
      JobApplicationRepository,
    }) => new CreateJobApplicationUseCase(
      new CreateJobApplicationZodValidator(),
      VacancyRepository,
      CandidateRepository,
      JobApplicationRepository,
    ))
    .add('FetchCandidateApplicationsUseCase', ({
      CandidateRepository,
      JobApplicationRepository,
    }) => new FetchCandidateApplicationsUseCase(
      new FetchCandidateApplicationsZodValidator(),
      CandidateRepository,
      JobApplicationRepository,
    )
  )
  .add('FetchVacancyApplicationsUseCase', ({
    CompanyRepository,
    VacancyRepository,
    JobApplicationRepository,
  }) => new FetchVacancyApplicationsUseCase(
    new FetchVacancyApplicationsZodValidator(),
    CompanyRepository,
    VacancyRepository,
    JobApplicationRepository,
  ))
  .add('UpdateJobApplicationStatusUseCase', ({
    CompanyRepository,
    JobApplicationRepository,
  }) => new UpdateJobApplicationStatusUseCase(
    new UpdateJobApplicationStatusZodValidator(),
    CompanyRepository,
    JobApplicationRepository,
  ))
  .add('ListVacanciesUseCase', ({
    CandidateRepository,
    VacancyRepository,
  }) => new ListVacanciesUseCase(
    new ListVacanciesZodValidator(),
    CandidateRepository,
    VacancyRepository,
  ))
  .add('GetCandidateDataUseCase', ({
    CandidateRepository,
  }) => new GetCandidateDataUseCase(
    new GetCandidateDataZodValidator(),
    CandidateRepository,
  ));
}

export type UseCasesDI = ReturnType<typeof configureUseCases>;
