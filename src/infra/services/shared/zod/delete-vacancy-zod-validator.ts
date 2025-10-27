import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { DeleteVacancyUseCase } from '@/application/usecases/company';
import z from 'zod';

export class DeleteVacancyZodValidator implements Validator<DeleteVacancyUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    vacancyId: z.string().uuid(),
  });

  async validate(input: any): Promise<DeleteVacancyUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}