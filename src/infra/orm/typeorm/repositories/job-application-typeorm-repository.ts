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

  async findBy(
  input: JobApplicationRepository.FindBy.Input,
  relations?: JobApplicationRepository.FindBy.Relations
): Promise<JobApplicationRepository.FindBy.Output> {
    const where = input.id
      ? { id: input.id }
      : {
          candidateId: input.candidateId,
          vacancyId: input.vacancyId,
        };

    const jobApplication = await this.repository.findOne({
      where,
      relations: {
        ...(relations?.candidate ? { candidate: true } : {}),
        ...(relations?.vacancy ? { vacancy: true } : {}),
      }
    });

    return jobApplication;
  }

  async setStatus(input: JobApplicationRepository.SetStatus.Input): Promise<JobApplicationRepository.SetStatus.Output> {
    const updated = await this.repository.findOne({ where: { id: input.id } });

    if (!updated) {
      return null;
    }

    return await this.repository.save({
      ...updated,
      status: input.status,
    });
  }

  async list(input: JobApplicationRepository.List.Input, relations?: JobApplicationRepository.List.Relations): Promise<JobApplicationRepository.List.Output> {
    const queryBuilder = this.repository.createQueryBuilder('jobApplication');

    const where: any = {};
    if (input.candidateId != null) where.candidateId = input.candidateId;
    if (input.vacancyId != null) where.vacancyId = input.vacancyId;
    
    const total = await this.repository.count({ where });

    if (input.candidateId) {
      queryBuilder.andWhere('jobApplication.candidateId = :candidateId', { candidateId: input.candidateId });
    }

    if (input.vacancyId) {
      queryBuilder.andWhere('jobApplication.vacancyId = :vacancyId', { vacancyId: input.vacancyId });
    }

    if (relations?.candidate) {
      queryBuilder.leftJoinAndSelect('jobApplication.candidate', 'candidate');
    }

    if (relations?.vacancy) {
      queryBuilder.leftJoinAndSelect('jobApplication.vacancy', 'vacancy');
    }

    const limit = input.limit ?? 10;
    const offset = input.offset ?? 0;

    queryBuilder.take(limit);
    queryBuilder.skip(offset);

    const jobApplications = await queryBuilder.getMany();

    return {
      jobApplications,
      total,
    };
}
  
  async delete(input: JobApplicationRepository.Delete.Input): Promise<JobApplicationRepository.Delete.Output> {
    await this.repository.delete({ id: input.id });
  }
}