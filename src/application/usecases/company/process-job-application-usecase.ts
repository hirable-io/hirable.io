import { NotFoundError } from '@/application/errors';
import { CompanyRepository, JobApplicationRepository, UserRepository } from '@/application/repositories';
import { NotifyService, SendEmail, Validator } from '@/application/services';
import { JobApplicationStatus } from '@/domain';
import { QueueNames } from '@/infra/queue/types';

export class ProcessJobApplicationUseCase {
  constructor(
    private readonly validator: Validator<ProcessJobApplicationUseCase.Input>,
    private readonly jobApplicationRepository: JobApplicationRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly notifyService: NotifyService,
  ) {}

  async execute(input: ProcessJobApplicationUseCase.Input): Promise<ProcessJobApplicationUseCase.Output> {
    const { userId, applicationId, status, message, sendMessage } = await this.validator.validate(input);

    const company = await this.findCompany(userId);

    const application = await this.findJobApplication(applicationId, company.id);

    await this.jobApplicationRepository.setStatus({
      id: application.id,
      status,
    });

    if (!sendMessage) {
      return { message: 'Job application status updated without notification.' };
    };

    const candidateEmail = await this.getCandidateEmail(application.candidate!.userId);

    await this.sendStatusEmail({
      candidateEmail,
      companyName: company.name,
      vacancyTitle: application.vacancy!.title,
      status,
      message,
    });

    return { message: 'Job application status updated and notification sent.' };
  }

  private async findCompany(userId: string) {
    const company = await this.companyRepository.findBy({ userId });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    return company;
  }

  private async findJobApplication(applicationId: string, companyId: string) {
    const jobApplication = await this.jobApplicationRepository.findBy(
      { id: applicationId },
      { vacancy: true, candidate: true },
    );
    
    if (!jobApplication) {
      throw new NotFoundError('Job application not found');
    }

    if (jobApplication.vacancy!.companyId !== companyId) {
      throw new NotFoundError('Job application not found');
    }

    return jobApplication;
  }

  private async getCandidateEmail(userId: string) {
    const user = await this.userRepository.findBy({ id: userId });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.email;
  }

  
  private async sendStatusEmail(params: {
    vacancyTitle: string
    companyName: string
    candidateEmail: string
    status: JobApplicationStatus
    message?: string
  }) {
    const { vacancyTitle, companyName, candidateEmail, status, message } = params;

    await this.notifyService.notify({
      queueName: QueueNames.sendEmail,
      payload: {
        to: candidateEmail,
        subject: `New update on your application for ${vacancyTitle}`,
        body:
          message ??
          `Hi there! Your application status has been updated to ${status}. If you have any questions, we are here to help. Best regards, ${companyName}`,
      } as SendEmail.Input,
    });
  }
}

export namespace ProcessJobApplicationUseCase {
  export type Input = {
    userId: string;
    applicationId: string;
    status: JobApplicationStatus;
    message?: string;
    sendMessage: boolean;
  }

  export type Output = {
    message: string;
  };
}