import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { FetchCandidateApplicationsUseCase } from '@/application/usecases/job-application';
import z from 'zod';

export class FetchCandidateApplicationsZodValidator implements Validator<FetchCandidateApplicationsUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
  });

  async validate(input: FetchCandidateApplicationsUseCase.Input): Promise<FetchCandidateApplicationsUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}