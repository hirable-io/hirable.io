import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTService } from '@/application/services';
import { env } from '@/env';

export class JWTServiceImpl implements JWTService {
  async sign(input: JWTService.Sign.Input): Promise<JWTService.Sign.Output> {

    const options: SignOptions = {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    };

    const token = jwt.sign(input.payload, env.ACCESS_TOKEN_SECRET, options);

    return token;
  }

  async verify(input: JWTService.Verify.Input): Promise<JWTService.Verify.Output> {
    const { token } = input;
  
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JWTService.Verify.Output;
  }
}