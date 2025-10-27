import { ValidationError } from '@/application/errors';
import { Validator } from '@/application/services';
import { LoginUsecase } from '@/application/usecases/account';
import z from 'zod';

export class LoginZodValidator implements Validator<LoginUsecase.Input> {
  private readonly schema = z.object({
    email: z.string().email(),
    password: z.string().nonempty(),
  });

  async validate(input: any): Promise<LoginUsecase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }

    return result.data;
  }
}