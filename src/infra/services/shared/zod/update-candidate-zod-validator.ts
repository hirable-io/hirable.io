import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { UpdateCandidateUseCase } from '@/application/usecases/candidate';
import z from 'zod';

export class UpdateCandidateZodValidator implements  Validator<UpdateCandidateUseCase.Input> {
  private readonly tagSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(50),
  });

  private readonly schema = z.object({
    userId: z.string().uuid(),
    data: z.object({
      fullName: z.string().min(1).max(255).optional(),
      phone: z.string().nonempty().transform((phone) => phone.replace(/\D/g, '')),
      linkedInUrl: z.string().url().max(255).optional(),
      bio: z.string().max(255).optional(),
      tags: z.array(this.tagSchema).optional(),
    }).partial(),
  });

  async validate(input: any): Promise<UpdateCandidateUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}