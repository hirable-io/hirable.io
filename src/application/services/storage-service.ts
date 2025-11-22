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

  export namespace Delete {
    export type Input = {
      url: string;
    };

    export type Output = void;
  }
}

export interface StorageService {
  upload(input: StorageService.Upload.Input): Promise<StorageService.Upload.Output>;
  delete(input: StorageService.Delete.Input): Promise<StorageService.Delete.Output>;
}