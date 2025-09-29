import { ValidationError } from '@/application/errors/validation-error';
import { Validator } from '@/application/services';
import { CreateAccountUseCase } from '@/application/usecases/account';
import { Roles } from '@/domain';
import z from 'zod';

export class CreateAccountZodValidator implements Validator<CreateAccountUseCase.Input> {
  private readonly schema = z
    .object({
      user: z.object({
        email: z.string().email(),
        password: z.string().nonempty(),
        role: z.enum([Roles.CANDIDATE, Roles.EMPLOYER]),
        phone: z.string().nonempty().transform((phone) => phone.replace(/\D/g, '')),
      }),
      candidate: z.object({
        fullName: z.string().min(3),
        bio: z.string().default(''),
      }).optional(),
      company: z.object({
        name: z.string().min(2),
        document: z.string().transform((doc) => doc.replace(/[^\d]/g, '')).pipe(z.string().length(14)),
        contactName: z.string().min(3),
        phone: z.string().nonempty().transform((phone) => phone.replace(/\D/g, '')),
      }).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.user.role === Roles.CANDIDATE) {
        if (!data.candidate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Candidate data is required for this role.',
            path: ['candidate'],
          });
        }
        if (data.company) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Company data is not allowed for candidate profiles.',
            path: ['company'],
          });
        }
      }
      if (data.user.role === Roles.EMPLOYER) {
        if (!data.company) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Company data is required for this role.',
            path: ['company'],
          });
        }
        if (data.candidate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Candidate data is not allowed for employer profiles.',
            path: ['candidate'],
          });
        }
      }
    });

  async validate(input: any): Promise<CreateAccountUseCase.Input> {
    const result = await this.schema.safeParseAsync(input);

    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }
    return result.data;
  }
}