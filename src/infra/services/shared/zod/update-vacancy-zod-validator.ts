import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { UpdateVacancyUseCase } from '@/application/usecases/company';
import z from 'zod';

export class UpdateVacancyZodValidator implements Validator<UpdateVacancyUseCase.Input> {
  private readonly schema = z.object({
    userId: z.string().uuid(),
    vacancyId: z.string().uuid(),
    data: z.object({
      title: z.string().min(5).max(100),
      description: z.string().min(20).max(1000),
      location: z.string().min(2).max(100),
      minimumSalaryValue: z.number().min(0),
      maximumSalaryValue: z.number().min(0),
      status: z.enum(['OPEN', 'CLOSED']),
      modality: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
      tags: z.array(z.object({
        id: z.number().int().positive(),
        name: z.string().min(2).max(50),
      })).optional(),
    }), 
  });

  async validate(input: any): Promise<UpdateVacancyUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}