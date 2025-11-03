import { env } from '@/env';
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import logger from '@/infra/logger';

export class BullMQ {
  private static instance: BullMQ;
  private queues: Map<string, Queue>;
  private workers: Map<string, Worker>;
  private connection: IORedis;

  private constructor() {
    this.connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
    this.queues = new Map();
    this.workers = new Map();
  }

  public static getInstance(): BullMQ {
    if (!BullMQ.instance) {
      BullMQ.instance = new BullMQ();
    }

    return BullMQ.instance;
  }

  public createQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, { connection: this.connection });
      this.queues.set(name, queue);
    }

    return this.queues.get(name)!;
  }

  public async addJob<T>(queueName: string, data: T): Promise<void> {
    const queue = this.createQueue(queueName);
    await queue.add(queueName, data, {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3,
    });
  }

  public addWorker(queueName: string, callback: (job: Job) => Promise<void>): void {
    if (this.workers.has(queueName)) {
      return;
    }

    const worker = new Worker(queueName, callback, { connection: this.connection });

    worker.on('completed', (job) => {
      logger.info(`✅ Job ${job.id} has been completed`);
    });

    worker.on('failed', (job, err) => {
      logger.error(`❌ Job ${job?.id} has failed with error ${err.message}`);
    });

    this.workers.set(queueName, worker);
  }

  public async close(): Promise<void> {
    await Promise.all([
      ...Array.from(this.workers.values()).map((worker) => worker.close()),
      ...Array.from(this.queues.values()).map((queue) => queue.close()),
    ]);

    await this.connection.quit();
  }
}

