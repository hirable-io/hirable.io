import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { ProcessJobApplicationUseCase } from '@/application/usecases/company';
import { JobApplicationStatuses } from '@/domain';
import z from 'zod';

export class ProcessJobApplicationZodValidator implements Validator<ProcessJobApplicationUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    applicationId: z.string().uuid(),
    status: z.nativeEnum(JobApplicationStatuses),
    message: z.string().optional(),
    sendMessage: z.boolean(),
  }).refine((data) => {
    if (data.sendMessage) {
      return data.message && data.message.length > 0;
    }
    return true;
  }, {
    message: 'Message is required when sendMessage is true',
  });

  async validate(input: unknown): Promise<ProcessJobApplicationUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}