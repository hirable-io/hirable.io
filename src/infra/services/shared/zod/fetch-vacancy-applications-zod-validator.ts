import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { FetchVacancyApplicationsUseCase } from '@/application/usecases/job-application';
import z from 'zod';

export class FetchVacancyApplicationsZodValidator implements Validator<FetchVacancyApplicationsUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    vacancyId: z.string().uuid(),
  });

  async validate(input: unknown): Promise<FetchVacancyApplicationsUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}