import { Job, UnrecoverableError } from 'bullmq';
import logger from '@/infra/logger';
import { container } from '@/infra/container';

export async function sendEmailWorker(job: Job) {
  logger.info('Executing send email worker for job %o', job.data);
  try {
    const service = container.get('SendEmailService');
    await service.sendEmail(job.data);
  } catch (error) {
    logger.error('Error executing send email worker for job %o: %s', job.data, error);
    throw new UnrecoverableError('Failed to send email');
  }
}