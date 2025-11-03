import cors from 'cors';
import { env } from '@/env';
import express from 'express';
import { errorHandler, loggerMiddleware } from '@/api/middlewares';
import health from './routes/health';
import { authRoute, userRoute, candidateRoute, companyRoute } from '@/api/routes';

import swaggerUi from 'swagger-ui-express';
import swaggerFile from '@/infra/docs/swagger/swagger-output.json';

const app = express();
app.use(express.json());
app.use(loggerMiddleware);
app.use(cors({
  credentials: true,
  origin: env.CORS_ORIGIN || '*',
}));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get('/health', health);

app.use('/auth', authRoute);

app.use('/user', userRoute);

app.use('/candidate', candidateRoute);

app.use('/company', companyRoute);

app.use(errorHandler);

export default app;
