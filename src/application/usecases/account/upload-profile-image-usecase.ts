import { NotFoundError } from '@/application/errors';
import { UserRepository } from '@/application/repositories';
import { StorageService, Validator } from '@/application/services';
import { randomUUID } from 'node:crypto';

export class UploadImageUseCase {
  constructor(
    private readonly validator: Validator<UploadImageUseCase.Input>,
    private readonly userRepository: UserRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(input: UploadImageUseCase.Input): Promise<UploadImageUseCase.Output> {
    const { userId, file, mimeType } = await this.validator.validate(input);

    const user = await this.ensureUserExists(userId);

    const url = await this.uploadImage(file, mimeType);

    await this.userRepository.update(user.id, {
      imageUrl: url,
    });

    return { url };
  }

  private async ensureUserExists(userId: string) {
    const user = await this.userRepository.findBy({ id: userId });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  private async uploadImage(file: Buffer, mimeType: string) {
    const fileName = `profiles/${randomUUID()}`;
    
    const { url } =  await this.storageService.upload({
      fileName,
      buffer: file,
      mimeType,
    });

    return url;
  }
}

export namespace UploadImageUseCase {
  export type Input = {
    userId: string;
    file: Buffer;
    mimeType: string;
  };

  export type Output = {
    url: string;
  };
}