import { Initializer, Service } from "fastify-decorators";

@Service()
export class Logger {
  private log: any;

  @Initializer()
  async init() {
    this.log = console;
  }

  async info(data: any, message?: string) {
    this.log.info(data, message);
  }

  async error(data: any, message?: string) {
    this.log.error(data, message);
  }
}
