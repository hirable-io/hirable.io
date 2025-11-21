import cors from 'cors';
import { env } from '@/env';
import express, { Router } from 'express';
import { errorHandler, loggerMiddleware } from '@/api/middlewares';
import health from './routes/health';
import { authRoute, userRoute, candidateRoute, companyRoute, tagRoute } from '@/api/routes';

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
const api = Router();

api.get('/health', health);
api.use('/auth', authRoute);
api.use('/user', userRoute);
api.use('/candidate', candidateRoute);
api.use('/company', companyRoute);
api.use('/tags', tagRoute);

app.use('/api/v1', api);

app.use(errorHandler);

export default app;
