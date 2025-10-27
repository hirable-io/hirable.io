import { z } from 'zod';
import process from 'node:process';

const envSchema = z.object({
  PORT: z.coerce.number().default(3021),
  APP_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  DB_PORT: z.coerce.number().default(5432),
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  POSTGRES_URL: z.string(),
  CORS_ORIGIN: z.string().optional(),
  ACCESS_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRES_IN: z.coerce.number().min(1),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().default('local'),
  AWS_SECRET_ACCESS_KEY: z.string().default('local'),
  AWS_S3_BUCKET: z.string().default('hirable-bucket'),
  AWS_S3_ENDPOINT: z.string().default('http://localhost:4566'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error('Invalid environment variables', { cause: parsed.error.issues });
}

export const env = parsed.data;