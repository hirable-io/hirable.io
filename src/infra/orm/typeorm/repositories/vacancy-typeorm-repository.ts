import { VacancyRepository } from '@/application/repositories';
import { TagEntity, VacancyEntity, VacancySchema } from '../entities';
import { DataSource, In, Repository } from 'typeorm';

export class VacancyTypeOrmRepository implements VacancyRepository {
  private readonly repository: Repository<VacancySchema>;
  constructor(
    private readonly datasource: DataSource,
  ) {
    this.repository = this.datasource.getRepository(VacancyEntity);
  }

  async create(input: VacancyRepository.Create.Input): Promise<VacancyRepository.Create.Output> {
    const vacancy = this.repository.create(input);
    const savedVacancy = await this.repository.save(vacancy);
    
    return savedVacancy;
  }

  async findBy(input: VacancyRepository.FindBy.Input): Promise<VacancyRepository.FindBy.Output> {
    const queryBuilder = this.repository.createQueryBuilder('vacancy');

    if (input.id) {
      queryBuilder.andWhere('vacancy.id = :id', { id: input.id });
    }

    queryBuilder.leftJoinAndSelect('vacancy.tags', 'tags');

    const vacancy = await queryBuilder.getOne();

    return vacancy;
  }

  async update(id: string, input: VacancyRepository.Update.Input): Promise<VacancyRepository.Update.Output> {
    const vacancy = await this.repository.findOne(
      { where: { id },
      relations: { tags: true },
    });

    if (!vacancy) {
      return null;
    }

    if (input.tags) {
      const tagRepository = this.datasource.getRepository(TagEntity);
      const tagsIds = input.tags.map(tag => tag.id);
      const tags = await tagRepository.find({ where: { id: In(tagsIds) } });

      vacancy.tags = tags;
      delete input.tags;
    }

    const savedVacancy = await this.repository.save({
      ...vacancy,
      ...input,
    });

    return savedVacancy;
  }

  async list(input: VacancyRepository.List.Input, filter?: VacancyRepository.List.Filter): Promise<VacancyRepository.List.Output> {
    const queryBuilder = this.repository.createQueryBuilder('vacancy');

    if (filter?.modality) {
      queryBuilder.andWhere('vacancy.modality = :modality', { modality: filter.modality });
    }

    queryBuilder.leftJoinAndSelect('vacancy.tags', 'tags');

    const limit = input.limit ?? 10;
    const offset = input.offset ?? 0;

    queryBuilder.take(limit).skip(offset);

    const [vacancies, total] = await queryBuilder.orderBy('vacancy.createdAt', 'DESC').getManyAndCount();

    return {
      vacancies,
      total,
    };
  }

  async listApplied(input: VacancyRepository.ListApplied.Input): Promise<VacancyRepository.ListApplied.Output> {
    const queryBuilder = this.repository.createQueryBuilder('vacancy');

    queryBuilder.innerJoin(
      'vacancy.jobApplications', 
      'jobApplication', 
      'jobApplication.candidateId = :candidateId', 
      { candidateId: input.candidateId }
    );

    queryBuilder.leftJoinAndSelect('vacancy.tags', 'tags');

    const limit = input.limit ?? 10;
    const offset = input.offset ?? 0;

    queryBuilder.take(limit).skip(offset);

    const [vacancies, total] = await queryBuilder.orderBy('vacancy.createdAt', 'DESC').getManyAndCount();

    return {
      vacancies,
      total,
    };
  }

  async listAvailable(input: VacancyRepository.ListAvailable.Input): Promise<VacancyRepository.ListAvailable.Output> {
    const queryBuilder = this.repository.createQueryBuilder('vacancy');

    queryBuilder.leftJoin(
      'vacancy.jobApplications', 
      'jobApplication', 
      'jobApplication.candidateId = :candidateId', 
      { candidateId: input.candidateId }
    );

    if (input?.modality) {
      queryBuilder.andWhere('vacancy.modality = :modality', { modality: input.modality });
    }

    queryBuilder.andWhere('jobApplication.id IS NULL');

    queryBuilder.leftJoinAndSelect('vacancy.tags', 'tags');

    const limit = input.limit ?? 10;
    const offset = input.offset ?? 0;

    queryBuilder.take(limit).skip(offset);

    const [vacancies, total] = await queryBuilder.orderBy('vacancy.createdAt', 'DESC').getManyAndCount();

    return {
      vacancies,
      total,
    };
  }

  async delete(input: VacancyRepository.Delete.Input): Promise<VacancyRepository.Delete.Output> {
    await this.repository.delete({ id: input.id });
  }

  async findMany(input: VacancyRepository.FindMany.Input): Promise<VacancyRepository.FindMany.Output> {
    const queryBuilder = this.repository.createQueryBuilder('vacancy');
    const totalAmount = await this.repository.count({ where: { companyId: input.companyId } });

    if (input.companyId) {
      queryBuilder.andWhere('vacancy.companyId = :companyId', { companyId: input.companyId });
    }

    const limit = input.limit ?? 10;
    const offset = input.offset ?? 0;

    queryBuilder.take(limit).skip(offset).orderBy('vacancy.createdAt', 'DESC');

    const vacancies = await queryBuilder.getMany();

    return {
      vacancies,
      total: totalAmount,
    };
  }
}