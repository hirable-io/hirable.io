import { NotFoundError } from '@/application/errors';
import { CandidateRepository } from '@/application/repositories';
import { StorageService, Validator } from '@/application/services';
import { randomUUID } from 'node:crypto';

export class UploadResumeUseCase {
  constructor(
    private readonly validator: Validator<UploadResumeUseCase.Input>,
    private readonly candidateRepository: CandidateRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(input: UploadResumeUseCase.Input): Promise<UploadResumeUseCase.Output> {
    const { userId, file, mimeType } = await this.validator.validate(input);

    const candidate = await this.findCandidate(userId);

    const url = await this.uploadResume(file, mimeType);

    await this.candidateRepository.update(candidate.id, {
      resumeUrl: url,
    });

    return { resumeUrl: url };
  }

  private async findCandidate(userId: string) {
    const candidate = await this.candidateRepository.findBy({ userId });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    return candidate;
  }

  private async uploadResume(file: Buffer, mimeType: string) {
    const fileName = `resume/${randomUUID()}`;
    
    const { url } =  await this.storageService.upload({
      fileName,
      buffer: file,
      mimeType,
    });

    return url;
  }
}

export namespace UploadResumeUseCase {
  export type Input = {
    userId: string;
    file: Buffer;
    mimeType: string;
  };

  export type Output = {
    resumeUrl: string;
  };
}