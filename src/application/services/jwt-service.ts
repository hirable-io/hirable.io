import { Role } from '@/domain';

export namespace JWTService {
  export type Payload = {
    email: string;
    userId: string;
    role: Role;
  };

  export namespace Sign {
    export type Input = {
      payload: JWTService.Payload;
    };

    export type Output = string;
  }

  export namespace Verify {
    export type Input = {
      token: string;
    };

    export type Output = JWTService.Payload;
  }
}

export interface JWTService {
  sign(input: JWTService.Sign.Input): Promise<JWTService.Sign.Output>;
  verify(input: JWTService.Verify.Input): Promise<JWTService.Verify.Output>;
}