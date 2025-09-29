export namespace HashingService {
  export namespace Hash {
    export type Input = string;
    export type Output = string;
  }

  export namespace Compare {
    export type Input = {
      plainText: string;
      hashedText: string;
    };
    export type Output = boolean;
  }
}
export interface HashingService {
  hash(input: HashingService.Hash.Input): Promise<HashingService.Hash.Output>;
  compare(input: HashingService.Compare.Input): Promise<HashingService.Compare.Output>;
}