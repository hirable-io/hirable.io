export namespace StorageService {
  export namespace Upload {
    export type Input = {
      fileName: string;
      buffer: Buffer;
      mimeType: string;
    };

    export type Output = {
      url: string;
    };
  }
}

export interface StorageService {
  upload(input: StorageService.Upload.Input): Promise<StorageService.Upload.Output>;
}