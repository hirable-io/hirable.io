import { ValidationError } from '@/application/errors';
import { ListCompanyVacancyUseCase } from '@/application/usecases/company';
import z from 'zod';

export class ListCompanyVacancyZodValidator {
  private readonly schema  = z.object({
    userId: z.string().uuid(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  });

  async validate(input: unknown): Promise<ListCompanyVacancyUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}