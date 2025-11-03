import { NotFoundError } from '@/application/errors';
import { CandidateRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { Candidate } from '@/domain';

export class UpdateCandidateUseCase {
  constructor(
    private readonly validator: Validator<UpdateCandidateUseCase.Input>,
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(input: UpdateCandidateUseCase.Input): Promise<UpdateCandidateUseCase.Output> {
    const { data, userId } = await this.validator.validate(input);

    const candidate = await this.findCandidate(userId);

    const updatedCandidate = await this.updateCandidateData(candidate.id, data);

    return updatedCandidate;
  }

  private async findCandidate(userId: string) {
    const candidate = await this.candidateRepository.findBy({ userId });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    return candidate;
  }

  private async updateCandidateData(
    id: string,
    data: CandidateRepository.Update.Input,
  ): Promise<Candidate> {
    const candidate = await this.candidateRepository.update(id, data);
    
    return candidate!;
  }
}

export namespace UpdateCandidateUseCase {
  export type Input = {
    userId: string;
    data: Partial<Omit<Candidate, 'id' | 'createdAt' | 'resumeUrl' | 'userId'>>;
  }

  export type Output = Candidate;
}