import { StorageService } from '@/application/services';
import { env } from '@/env';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class S3StorageService implements StorageService {
  constructor(
    private readonly s3Client: S3Client,
  ) {}

  async upload(params: StorageService.Upload.Input): Promise<StorageService.Upload.Output> {
    const { fileName, buffer, mimeType } = params;

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);

    const url = this.formatUrl(fileName);

    return { url };
  }

  private formatUrl(fileName: string): string {
    return env.NODE_ENV === 'prod'
      ? `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${fileName}`
      : `${env.AWS_S3_ENDPOINT}/${env.AWS_S3_BUCKET}/${fileName}`;
  }

  async delete(params: StorageService.Delete.Input): Promise<StorageService.Delete.Output> {
    const { url } = params;

    const command = new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: this.extractKeyFromUrl(url),
    });

    await this.s3Client.send(command);
  }

  private extractKeyFromUrl(url: string): string {
    if (env.NODE_ENV === 'prod') {
      const prefix = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/`;
      return url.startsWith(prefix) ? url.slice(prefix.length) : url;
    } else {
      const prefix = `${env.AWS_S3_ENDPOINT}/${env.AWS_S3_BUCKET}/`;
      return url.startsWith(prefix) ? url.slice(prefix.length) : url;
    }
  }
}