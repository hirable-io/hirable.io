export namespace NotifyService {
  export type Input = {
    queueName: string;
    payload: any;
  }

  export type Output = void;
}

export interface NotifyService {
  notify(input: NotifyService.Input): Promise<NotifyService.Output>;
}