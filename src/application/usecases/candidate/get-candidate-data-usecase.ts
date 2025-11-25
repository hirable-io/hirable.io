import { NotFoundError } from '@/application/errors';
import { CandidateRepository } from '@/application/repositories';
import { Validator } from '@/application/services';
import { Candidate } from '@/domain';

export class GetCandidateDataUseCase {
  constructor(
    private readonly validator: Validator<GetCandidateDataUseCase.Input>,
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(input: GetCandidateDataUseCase.Input): Promise<GetCandidateDataUseCase.Output> {
    const { userId } = await this.validator.validate(input);

    const candidate = await this.candidateRepository.findBy({ userId });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    return candidate;
  }
}

export namespace GetCandidateDataUseCase {
  export type Input = {
    userId: string;
  }

  export type Output = Candidate;
}