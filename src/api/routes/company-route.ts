import express, { Request, Response, Router } from 'express';
import { container } from '@/infra/container';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares';
import { Roles } from '@/domain';

const router: Router = express.Router();

router.post(
  '/vacancy',
  authenticationMiddleware,
  authorizationMiddleware([Roles.EMPLOYER]),
  async (req: Request, res: Response) => {
    const usecase = container.get('CreateVacancyUseCase');

    const result = await usecase.execute({
      userId: req.user.userId,
      data: req.body,
    });

    return res.status(201).json(result);
  }
);

router.delete(
  '/vacancy/:id',
  authenticationMiddleware,
  authorizationMiddleware([Roles.EMPLOYER]),
  async (req: Request, res: Response) => {
    const usecase = container.get('DeleteVacancyUseCase');

    await usecase.execute({
      userId: req.user.userId,
      vacancyId: req.params.id,
    });

    return res.status(204).send();
  }
);

router.put(
  '/vacancy/:id',
  authenticationMiddleware,
  authorizationMiddleware([Roles.EMPLOYER]),
  async (req: Request, res: Response) => {
    const usecase = container.get('UpdateVacancyUseCase');

    const result = await usecase.execute({
      userId: req.user.userId,
      vacancyId: req.params.id,
      data: req.body,
    });

    return res.status(200).json(result);
  }
);

export { router as companyRoute };