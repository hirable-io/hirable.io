import { Job } from 'bullmq';
import { BullMQ } from '../bullmq';
import { QueueNames } from '../types';
import { sendEmailWorker } from './send-email-worker';

async function createWorkers() {
  const bullMQ = BullMQ.getInstance();

  bullMQ.addWorker(QueueNames.sendEmail, async (job: Job) => sendEmailWorker(job));
}

export { createWorkers };