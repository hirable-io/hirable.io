import { NotFoundError } from '@/application/errors';
import { CandidateRepository } from '@/application/repositories';
import { StorageService, Validator } from '@/application/services';
import { Candidate } from '@/domain';

export class DeleteCandidateFileUseCase {
  constructor(
    private readonly validator: Validator<DeleteCandidateFileUseCase.Input>,
    private readonly candidateRepository: CandidateRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(input: DeleteCandidateFileUseCase.Input): Promise<void> {
    const { userId, fileType } = await this.validator.validate(input);

    const candidate = await this.findCandidate(userId);

    await this.deleteFile(candidate, fileType);
  }

  private async findCandidate(userId: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findBy({ userId });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    return candidate;
  }

  private async deleteFile(candidate: Candidate, fileType: 'RESUME' | 'IMAGE') {
    const fileMap = {
      IMAGE: {
        field: 'imageUrl' as const,
        notFoundMessage: 'Profile picture not found',
      },
      RESUME: {
        field: 'resumeUrl' as const,
        notFoundMessage: 'Resume not found',
      },
    };

    const { field, notFoundMessage } = fileMap[fileType];
    const fileUrl = candidate[field];

    if (!fileUrl) {
      throw new NotFoundError(notFoundMessage);
    }

    await this.storageService.delete({ url: fileUrl });

    await this.candidateRepository.update(candidate.id, {
      [field]: null,
    });
  }
}

export namespace DeleteCandidateFileUseCase {
  export type Input = {
    userId: string;
    fileType: 'RESUME' | 'IMAGE';
  };

  export type Output = void;
}
