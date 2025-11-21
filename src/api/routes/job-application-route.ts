import express, { Request, Response, Router } from 'express';
import { container } from '@/infra/container';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares';
import { Roles } from '@/domain';
import { CreateJobApplicationUseCase, FetchCandidateApplicationsUseCase, FetchVacancyApplicationsUseCase } from '@/application/usecases/job-application';

const router: Router = express.Router();

router.post(
  '/apply',
  authenticationMiddleware,
  authorizationMiddleware([Roles.CANDIDATE]),
  async (req: Request, res: Response) => {
  const usecase: CreateJobApplicationUseCase = container.get('CreateJobApplicationUseCase');
  const result = await usecase.execute({
    userId: req.user.userId,
    vacancyId: req.body.vacancyId,
  });

  return res.status(200).json(result);
});

router.get(
  '/applications',
  authenticationMiddleware,
  authorizationMiddleware([Roles.CANDIDATE]),
  async (req: Request, res: Response) => {
  const usecase: FetchCandidateApplicationsUseCase = container.get('FetchCandidateApplicationsUseCase');
  const result = await usecase.execute({
    userId: req.user.userId,
  });

  return res.status(200).json(result);
});

router.get(
  '/vacancy/:vacancyId/applications',
  authenticationMiddleware,
  authorizationMiddleware([Roles.EMPLOYER]),
  async (req: Request, res: Response) => {
    const usecase: FetchVacancyApplicationsUseCase = container.get('FetchVacancyApplicationsUseCase');
    const result = await usecase.execute({
      userId: req.user.userId,
      vacancyId: req.params.vacancyId,
    });

    return res.status(200).json(result);
  }
);

router.patch(
  '/application/:applicationId/status',
  authenticationMiddleware,
  authorizationMiddleware([Roles.EMPLOYER]),
  async (req: Request, res: Response) => {
    const usecase = container.get('UpdateJobApplicationStatusUseCase');
    const result = await usecase.execute({
      userId: req.user.userId,
      applicationId: req.params.applicationId,
      status: req.body.status,
    });

    return res.status(200).json(result);
  }
);

export { router as jobApplicationRoute };