import { S3Client, S3ClientConfigType } from '@aws-sdk/client-s3';
import { env } from '@/env';

type Config = {
  [K in typeof env.NODE_ENV]: S3ClientConfigType;
};

const config: Config = {
  dev: {
    region: env.AWS_REGION,
    endpoint: env.AWS_S3_ENDPOINT,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  },
  test: {
    region: env.AWS_REGION,
    endpoint: env.AWS_S3_ENDPOINT,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  },
  prod: {
    region: env.AWS_REGION,
  },
};

const s3Client = new S3Client(config[env.NODE_ENV]);

export { s3Client };