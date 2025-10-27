  import express, { Request, Response, Router } from 'express';
  import { container } from '@/infra/container';
  import { UploadImageUseCase } from '@/application/usecases/account';
  import { authenticationMiddleware } from '../middlewares';
  import multer from 'multer';

  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  const router: Router = express.Router();

  router.post(
    '/profile-image',
    authenticationMiddleware,
    upload.single('file'),
    async (req: Request, res: Response) => {
    const usecase: UploadImageUseCase = container.get('UploadImageUseCase');
    const result = await usecase.execute({
      userId: req.user.userId,
      file: req.file!.buffer,
      mimeType: req.file!.mimetype,
    });

    return res.status(201).json(result);
  });

  export { router as userRoute };