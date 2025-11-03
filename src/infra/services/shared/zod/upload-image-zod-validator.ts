import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { UploadImageUseCase } from '@/application/usecases/account/upload-profile-image-usecase';
import { z } from 'zod';

export class UploadImageZodValidator implements Validator<UploadImageUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    file: z
      .instanceof(Buffer)
      .refine((buf) => Buffer.isBuffer(buf), 'File must be a valid Buffer')
      .refine((buf) => buf.length > 0, 'File buffer cannot be empty'),
    mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  });

  async validate(input: any): Promise<UploadImageUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}