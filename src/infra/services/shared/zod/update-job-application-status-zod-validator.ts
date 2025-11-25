import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { UpdateJobApplicationStatusUseCase } from '@/application/usecases/job-application';
import { JobApplicationStatuses } from '@/domain';
import z from 'zod';

export class UpdateJobApplicationStatusZodValidator implements Validator<UpdateJobApplicationStatusUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    applicationId: z.string().uuid(),
    status: z.nativeEnum(JobApplicationStatuses),
  });

  async validate(input: unknown): Promise<UpdateJobApplicationStatusUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}