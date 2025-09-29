import bcrypt from 'bcrypt';
import { HashingService } from '@/application/services';

export class HashingBcryptService implements HashingService {
  private readonly saltRounds = 10;
  constructor() {}
  
  async hash(input: HashingService.Hash.Input): Promise<HashingService.Hash.Output> {
    const hashed = await bcrypt.hash(input, this.saltRounds);
    return hashed;
  }

  async compare(input: HashingService.Compare.Input): Promise<HashingService.Compare.Output> {
    const { plainText, hashedText } = input;
    const isMatch = await bcrypt.compare(plainText, hashedText);
    return isMatch;
  }
}