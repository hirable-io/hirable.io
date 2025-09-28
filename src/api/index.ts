import cors from 'cors';
import { env } from '@/env';
import express from 'express';
import { errorHandler, loggerMiddleware } from '@/api/middlewares';
import health from './routes/health';

const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: env.CORS_ORIGIN || '*',
}));
app.use(errorHandler);
app.use(loggerMiddleware);

app.get('/health', health);

export default app;