import { JobsOptions, Worker } from "bullmq";
import { Destructor, Initializer, Inject, Service } from "fastify-decorators";
import { RedisConnection } from "../../configs/connections/redis.connection";

@Service()
export class BaseWorker<T = any> {
  @Inject(RedisConnection)
  protected redis: RedisConnection;

  protected worker: Worker;

  protected workerName = "";

  protected concurrency = 1;

  @Initializer([RedisConnection])
  init() {
    if (!this.workerName) {
      throw new Error("no worker name found");
    }

    this.worker = new Worker<T>(
      this.workerName,
      async ({ data, attemptsMade, opts, id }) => {
        await this.handle(data, attemptsMade, opts, id);
      },
      { connection: this.redis.client, concurrency: this.concurrency }
    );

    return this.worker;
  }

  @Destructor()
  async destroy() {
    await this.worker.close();
  }

  protected async handle(
    data: T,
    attemptsMade: number,
    opts: JobsOptions,
    id?: string
  ) {
    if (this && data && attemptsMade && opts && id)
      throw new Error("no worker implementation found");
  }
}
