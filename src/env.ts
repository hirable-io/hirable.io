import { z } from 'zod';
import process from 'node:process';

const envSchema = z.object({
  PORT: z.coerce.number().default(3021),
  APP_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  DB_PORT: z.coerce.number().default(5432),
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  POSTGRES_URL: z.string(),
  CORS_ORIGIN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error('Invalid environment variables', { cause: parsed.error.issues });
}

export const env = parsed.data;