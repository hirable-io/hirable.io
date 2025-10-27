import { S3StorageService, s3Client } from '@/infra/services/storage/s3';
import { RepositoriesDI } from './repositories';
import { HashingBcryptService, JWTServiceImpl } from '@/infra/services';

export function configureServices(container: RepositoriesDI) {
  return container
    .add('HashingService', () => new HashingBcryptService())
    .add('JWTService', () => new JWTServiceImpl())
    .add('StorageService', () => new S3StorageService(s3Client));
}

export type ServicesDI = ReturnType<typeof configureServices>;
