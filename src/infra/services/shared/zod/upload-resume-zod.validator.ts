import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { UploadResumeUseCase } from '@/application/usecases/candidate';
import { z } from 'zod';

export class UploadResumeZodValidator implements Validator<UploadResumeUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    file: z
      .instanceof(Buffer)
      .refine((buf) => Buffer.isBuffer(buf), 'File must be a valid Buffer')
      .refine((buf) => buf.length > 0, 'File buffer cannot be empty'),
    mimeType: z.enum(['application/pdf']),
  });

  async validate(input: any): Promise<UploadResumeUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}