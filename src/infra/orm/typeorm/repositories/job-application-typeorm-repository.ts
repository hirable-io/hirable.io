import { JobApplicationRepository } from '@/application/repositories';
import { JobApplicationEntity, JobApplicationSchema } from '../entities';
import { DataSource, Repository } from 'typeorm';

export class JobApplicationTypeOrmRepository implements JobApplicationRepository {
  private readonly repository: Repository<JobApplicationSchema>;

  constructor(
    private readonly datasource: DataSource,
  ) {
    this.repository = this.datasource.getRepository(JobApplicationEntity);
  }
  async create(input: JobApplicationRepository.Create.Input): Promise<JobApplicationRepository.Create.Output> {
    const jobApplication = this.repository.create(input);
    await this.repository.save(jobApplication);

    return jobApplication;
  }

  async findBy(input: JobApplicationRepository.FindBy.Input): Promise<JobApplicationRepository.FindBy.Output> {
    const jobApplication = await this.repository.findOne({
      where: {
        candidateId: input.candidateId,
        vacancyId: input.vacancyId,
      }
    });

    return jobApplication;
  }

  async list(input: JobApplicationRepository.List.Input): Promise<JobApplicationRepository.List.Output> {
    const queryBuilder = this.repository.createQueryBuilder('jobApplication');

    if (input.candidateId) {
      queryBuilder.andWhere('jobApplication.candidateId = :candidateId', { candidateId: input.candidateId });
    }

    if (input.vacancyId) {
      queryBuilder.andWhere('jobApplication.vacancyId = :vacancyId', { vacancyId: input.vacancyId });
    }

    queryBuilder.leftJoinAndSelect('jobApplication.candidate', 'candidate');
    queryBuilder.leftJoinAndSelect('jobApplication.vacancy', 'vacancy');

    const jobApplications = await queryBuilder.getMany();

    return jobApplications;
  }
  
  async delete(input: JobApplicationRepository.Delete.Input): Promise<JobApplicationRepository.Delete.Output> {
    await this.repository.delete({ id: input.id });
  }
}