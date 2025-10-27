import { NotFoundError } from '@/application/errors';
import { UserRepository } from '@/application/repositories';
import { HashingService, JWTService, Validator } from '@/application/services';

export class LoginUsecase {
  constructor(
    private readonly validator: Validator<LoginUsecase.Input>,
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JWTService,
  ) {}

  async execute(input: LoginUsecase.Input): Promise<LoginUsecase.Output> {
    const { email, password } = await this.validator.validate(input);

    const user = await this.findUser(email);

    await this.verifyPassword(password, user.passwordHash);

    const accessToken = await this.jwtService.sign({
      payload: {
        email: user.email,
        role: user.role,
        userId: user.id,
      },
    });

    return { accessToken };
  }

  private async findUser(email: string) {
    const user = await this.userRepository.findBy({ email });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  private async verifyPassword(password: string, passwordHash: string) {
    const isPasswordValid = await this.hashingService.compare({
      plainText: password,
      hashedText: passwordHash,
    });

    if (!isPasswordValid) {
      throw new NotFoundError('User not found');
    }
  }
}

export namespace LoginUsecase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
  };
}