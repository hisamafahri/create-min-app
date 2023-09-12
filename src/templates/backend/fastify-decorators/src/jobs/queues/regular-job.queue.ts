import { Queue, RepeatOptions } from "bullmq";
import { Destructor, Initializer, Inject, Service } from "fastify-decorators";
import { RedisConnection } from "../../configs/connections/redis.connection";
import {
  REGULAR_JOB_QUEUE,
} from "../../lib/constants/queue";

@Service()
export class RegularJobQueue {
  @Inject(RedisConnection)
  private redis: RedisConnection;

  private queue: Queue;

  @Initializer([RedisConnection])
  async init() {
    this.queue = new Queue(REGULAR_JOB_QUEUE, {
      connection: this.redis.client,
    });

    await this.queue.drain(true);
    await this.queue.clean(0, 9999, "failed");

    // Ref:
    // cron job expression generator: https://crontab.cronhub.io/

    // this.addRegularJob(SAMPLES_JOB, {
    //   pattern: "*/5 * * * *", // every 5 minutes
    // });

    // Uncomment this line in case want to pause regular jobs
    // await this.queue.pause();
  }

  async addRegularJob(name: string, repeat: RepeatOptions) {
    this.queue.add(
      name,
      {},
      {
        repeat,
        jobId: name,
      }
    );
  }

  async removeRegularJob(name: string, repeat: RepeatOptions) {
    await this.queue.removeRepeatable(name, repeat);
  }

  async clean(duration = 60 * 60 * 1000, limit = 999999) {
    await this.queue.clean(duration, limit, "completed");
  }

  @Destructor()
  async destroy() {
    await this.queue.close();
  }
}
