import { Candidate } from '@/domain';

export namespace CandidateRepository {
  export namespace Create {
    export type Input = Candidate;
    export type Output = Candidate;
  }

  export namespace FindBy {
    export type Input = Partial<{
      id: string;
      userId: string;
    }>

    export type Output = Candidate | null;
  }

  export namespace Update {
    export type Input = Partial<Omit<Candidate, 'id' | 'userId'>> & {
      resumeUrl?: string | null;
      imageUrl?: string | null;
    };
    export type Output = Candidate | null;
  }
}

export interface CandidateRepository {
  create(input: CandidateRepository.Create.Input): Promise<CandidateRepository.Create.Output>;
  findBy(input: CandidateRepository.FindBy.Input): Promise<CandidateRepository.FindBy.Output>;
  update(id: string, input: CandidateRepository.Update.Input): Promise<CandidateRepository.Update.Output>;
}