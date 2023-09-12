import { JobType, JobsOptions, Queue } from "bullmq";
import { Destructor, Initializer, Inject, Service } from "fastify-decorators";
import ms from "ms";
import { RedisConnection } from "../../configs/connections/redis.connection";

@Service()
export class BaseQueue<T = any> {
  @Inject(RedisConnection)
  protected redis: RedisConnection;

  queue: Queue<T>;

  protected queueName = "";

  @Initializer([RedisConnection])
  init() {
    if (!this.queueName) {
      throw new Error("no queue name found");
    }

    this.queue = new Queue(this.queueName, {
      connection: this.redis.client,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: ms("5m"),
        },
      },
    });
  }

  @Destructor()
  async destroy() {
    await this.queue.close();
  }

  async addJob(jobData: T, opt: JobsOptions = {}) {
    await this.queue.add(this.queueName, jobData, opt);
  }

  async clean(duration = 60 * 60 * 1000, limit = 999999) {
    await this.queue.clean(duration, limit, "completed");
  }

  async remove(
    jobId: string,
    opts?: {
      removeChildren?: boolean;
    }
  ) {
    await this.queue.remove(jobId, opts);
  }

  async getJobs(
    types?: JobType[] | JobType,
    start?: number,
    end?: number,
    asc?: boolean
  ) {
    const jobs = await this.queue.getJobs(types, start, end, asc);

    return jobs;
  }

  async getNonCompletedJobs(start?: number, end?: number, asc?: boolean) {
    const jobs = await this.queue.getJobs(
      [
        "delayed",
        "active",
        "delayed",
        "prioritized",
        "waiting",
        "waiting-children",
        "paused",
        "repeat",
        "wait",
        "failed",
      ],
      start,
      end,
      asc
    );

    return jobs;
  }
}
