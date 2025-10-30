import { NotifyService } from '@/application/services';
import { BullMQ } from './bullmq';

export class NotifyBullMQService implements NotifyService {
  async notify(input: NotifyService.Input): Promise<NotifyService.Output> {
    const { queueName, payload } = input;

    const bullMQ = BullMQ.getInstance();
    await bullMQ.addJob(queueName, payload);
  }
}