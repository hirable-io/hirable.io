import express, { Request, Response, Router } from 'express';
import { container } from '@/infra/container';
import { UploadResumeUseCase } from '@/application/usecases/candidate';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares';
import { upload } from '@/api/middlewares';
import { Roles } from '@/domain';

const router: Router = express.Router();

router.post(
  '/resume',
  authenticationMiddleware,
  authorizationMiddleware([Roles.CANDIDATE]),
  upload.single('file'),
  async (req: Request, res: Response) => {
  const usecase: UploadResumeUseCase = container.get('UploadResumeUseCase');
  
  const result = await usecase.execute({
    userId: req.user.userId,
    file: req.file!.buffer,
    mimeType: req.file!.mimetype,
  });

  return res.status(201).json(result);
});

router.put(
  '/',
  authenticationMiddleware,
  authorizationMiddleware([Roles.CANDIDATE]),
  async (req: Request, res: Response) => {
    const usecase = container.get('UpdateCandidateUseCase');
    
    const result = await usecase.execute({
      userId: req.user.userId,
      data: req.body,
    });

    return res.status(200).json(result);
  }
);

router.get(
  '/vacancy',
  authenticationMiddleware,
  authorizationMiddleware([Roles.CANDIDATE]),
  async (req: Request, res: Response) => {
    const usecase = container.get('ListVacanciesUseCase');
    
    const result = await usecase.execute({
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined,
      modality: req.query.modality as any,
      userId: req.user.userId,
    });

    return res.status(200).json(result);
  }
);

export { router as candidateRoute };