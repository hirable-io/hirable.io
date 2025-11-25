import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { ListVacanciesUseCase } from '@/application/usecases/candidate';
import { Modalities } from '@/domain';
import z from 'zod';

export class ListVacanciesZodValidator implements Validator<ListVacanciesUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    limit: z.number().int().positive().optional(),
    offset: z.number().int().min(0).optional(),
    modality: z.nativeEnum(Modalities).optional(),
  });

  async validate(input: unknown): Promise<ListVacanciesUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}