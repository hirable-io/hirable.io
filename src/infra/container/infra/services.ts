import { S3StorageService, s3Client } from '@/infra/services/storage/s3';
import { RepositoriesDI } from './repositories';
import { HashingBcryptService, JWTServiceImpl } from '@/infra/services';
import { SendEmailNodemailerService } from '@/infra/services/send-email-nodemailer-service';
import { NotifyBullMQService } from '@/infra/queue/notify-bullmq-service';

export function configureServices(container: RepositoriesDI) {
  return container
    .add('HashingService', () => new HashingBcryptService())
    .add('JWTService', () => new JWTServiceImpl())
    .add('StorageService', () => new S3StorageService(s3Client))
    .add('SendEmailService', () => new SendEmailNodemailerService())
    .add('NotifyService', () => new NotifyBullMQService());
}

export type ServicesDI = ReturnType<typeof configureServices>;
