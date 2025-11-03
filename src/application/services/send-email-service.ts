export namespace SendEmail {
  export type Input = {
    to: string;
    subject: string;
    body: string;
  }

  export type Output = void;
}

export interface SendEmailService {
  sendEmail(input: SendEmail.Input): Promise<SendEmail.Output>;
}