import express, { Request, Response, Router } from 'express';
import { container } from '@/infra/container';
import { CreateAccountUseCase } from '@/application/usecases/account';

const router: Router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const usecase: CreateAccountUseCase = container.get('CreateAccountUseCase');
  const result = await usecase.execute(req.body);

  return res.status(201).json(result);
});

export { router as authRoute };