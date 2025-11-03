import logger from '@/infra/logger';
import app from '@/api';
import { env } from '@/env';
import { dbConnection } from './infra/orm/typeorm/datasource';
import { createWorkers } from './infra/queue/workers';
import { BullMQ } from './infra/queue/bullmq';
import { QueueNames } from './infra/queue/types';

async function startBullMQWorkers() {
  logger.info('⏳ Starting BullMQ workers...');
  await createWorkers();
  logger.info('✅ BullMQ workers started.');
}

async function server() {
  try {
    logger.info('⏳ Initializing database...');
    await dbConnection();
    await startBullMQWorkers();
    app.listen(env.PORT);
    const bull = BullMQ.getInstance();
    await bull.addJob(QueueNames.sendEmail, { to: 'artrsousa1@gmail.com', subject: 'Test Email', body: 'This is a test email.' });

    logger.info('🦊 Server already is up. Listening on port %d', env.PORT);
  } catch (error) {
    logger.error('Error on starting server: %s', error);
  }
}

server().catch((error) => {
  logger.error('Error on starting server', error);
});