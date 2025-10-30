import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { CreateJobApplicationUseCase } from '@/application/usecases/job-application';
import z from 'zod';

export class CreateJobApplicationZodValidator implements Validator<CreateJobApplicationUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    vacancyId: z.string().uuid(),
  });

  async validate(input: any): Promise<CreateJobApplicationUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}