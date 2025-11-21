import logger from '@/infra/logger';
import app from '@/api';
import { env } from '@/env';
import { dbConnection } from './infra/orm/typeorm/datasource';
import { createWorkers } from './infra/queue/workers';

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

    logger.info('🦊 Server already is up. Listening on port %d', env.PORT);
  } catch (error) {
    logger.error('Error on starting server: %s', error);
  }
}

server().catch((error) => {
  logger.error('Error on starting server', error);
});