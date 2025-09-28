import pino from 'pino';
import process from 'node:process';

const logger = pino({
  name: 'hirable',
  transport: process.env.NODE_ENV === 'prod'
    ? undefined
    : { target: 'pino-pretty' },
});

export default logger;