import express, { Request, Response, Router } from 'express';
import { container } from '@/infra/container';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares';
import { Roles } from '@/domain';
import { ListTagsUsecase } from '@/application/usecases/tags';

const router: Router = express.Router();

router.get(
  '/',
  authenticationMiddleware,
  authorizationMiddleware([Roles.CANDIDATE, Roles.EMPLOYER]),
  async (_req: Request, res: Response) => {
  const usecase: ListTagsUsecase = container.get('ListTagsUsecase');
  
  const result = await usecase.execute();

  return res.status(200).json(result);
});

export { router as tagRoute };