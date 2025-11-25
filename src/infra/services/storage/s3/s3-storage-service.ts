import { StorageService } from '@/application/services';
import { env } from '@/env';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

export class S3StorageService implements StorageService {
  constructor(private readonly s3Client: S3Client) {}

  async upload(
    params: StorageService.Upload.Input,
  ): Promise<StorageService.Upload.Output> {
    const { fileName, buffer, mimeType } = params;

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read', 
    });

    await this.s3Client.send(command);

    return {
      url: this.buildFileUrl(fileName),
    };
  }

  async delete(
    params: StorageService.Delete.Input,
  ): Promise<StorageService.Delete.Output> {
    const { url } = params;
    const key = this.extractKeyFromUrl(url);

    const command = new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  private buildFileUrl(fileName: string): string {
    const encodedFileName = encodeURIComponent(fileName);

    if (env.NODE_ENV === 'prod') {
      return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${encodedFileName}`;
    }

    const endpoint = env.AWS_S3_ENDPOINT.replace(/\/$/, '');
    return `${endpoint}/${env.AWS_S3_BUCKET}/${encodedFileName}`;
  }

  private extractKeyFromUrl(url: string): string {
    const decodeUrl = (u: string) => decodeURIComponent(u);

    if (env.NODE_ENV === 'prod') {
      const prefix = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/`;
      return url.startsWith(prefix) ? decodeUrl(url.substring(prefix.length)) : url;
    }

    const endpoint = env.AWS_S3_ENDPOINT.replace(/\/$/, '');
    const prefix = `${endpoint}/${env.AWS_S3_BUCKET}/`;

    return url.startsWith(prefix) ? decodeUrl(url.substring(prefix.length)) : url;
  }
}