import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { GetCandidateDataUseCase } from '@/application/usecases/candidate';
import z from 'zod';

export class GetCandidateDataZodValidator implements Validator<GetCandidateDataUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
  });

  async validate(input: unknown): Promise<GetCandidateDataUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}