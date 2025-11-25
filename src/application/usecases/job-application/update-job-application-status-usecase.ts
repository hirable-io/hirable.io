import { NotFoundError } from '@/application/errors';
import { CompanyRepository, JobApplicationRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { JobApplication, JobApplicationStatus } from '@/domain';

export class UpdateJobApplicationStatusUseCase {
  constructor(
    private readonly validator: Validator<UpdateJobApplicationStatusUseCase.Input>,
    private readonly companyRepository: CompanyRepository,
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(input: UpdateJobApplicationStatusUseCase.Input): Promise<UpdateJobApplicationStatusUseCase.Output> {
    const { userId, applicationId, status } = await this.validator.validate(input);

    const company = await this.companyRepository.findBy({ userId });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    const jobApplication = await this.jobApplicationRepository.findBy({ id: applicationId }, { vacancy: true });
    
    if (jobApplication?.vacancy?.companyId !== company.id) {
      throw new NotFoundError('Job application not found');
    }

    if (!jobApplication) {
      throw new NotFoundError('Job application not found');
    }

    const updatedJobApplication = await this.jobApplicationRepository.setStatus({
      id: jobApplication.id,
      status,
    });


    return updatedJobApplication!;
  }
}

export namespace UpdateJobApplicationStatusUseCase {
  export type Input = {
    userId: string;
    applicationId: string;
    status: JobApplicationStatus;
  }

  export type Output = JobApplication;
}