import { Candidate } from '@/domain';

export namespace CandidateRepository {
  export namespace Create {
    export type Input = Candidate;
    export type Output = Candidate;
  }
}

export interface CandidateRepository {
  create(input: CandidateRepository.Create.Input): Promise<CandidateRepository.Create.Output>;
}