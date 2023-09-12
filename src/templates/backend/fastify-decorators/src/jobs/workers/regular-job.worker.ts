/* eslint-disable indent */
import { Job, Worker } from "bullmq";
import { hoursToMilliseconds } from "date-fns";
import { Initializer, Inject, Service } from "fastify-decorators";
import { BaseWorker } from "../../lib/common/worker";
import { RedisConnection } from "../../configs/connections/redis.connection";
import { PostgreSQLConnection } from "../../configs/connections/postgresql.connection";
import { RegularJobQueue } from "../queues/regular-job.queue";
import { CLEAN_JOB, REGULAR_JOB_QUEUE } from "../../lib/constants/queue";
import { Logger } from "../../lib/utils/services/logger.service";

@Service()
export class RegularJobWorker extends BaseWorker {
  @Inject(PostgreSQLConnection)
  private psql: PostgreSQLConnection;

  @Inject(Logger)
  private logger: Logger;

  @Inject(RegularJobQueue)
  private regularJobQueue: RegularJobQueue;

  @Initializer([RedisConnection, PostgreSQLConnection])
  init() {
    this.worker = new Worker(
      REGULAR_JOB_QUEUE,
      async (job: Job) => {
        while (!this.psql.connection.isInitialized) {
          (() => null)();
        }

        switch (job.name) {
          case CLEAN_JOB:
            await this.cleanCompletedJobs(job);
            break;
          default:
            break;
        }
      },
      {
        connection: this.redis.client,
        concurrency: 10,
        removeOnComplete: {
          age: 3600, // keep up to 1 hour
          count: 1000, // keep up to 1000 jobs
        },
        removeOnFail: {
          count: 1,
        },
      }
    );

    return this.worker;
  }

  private async cleanCompletedJobs(job: Job) {
    try {
      await Promise.all([this.regularJobQueue.clean(hoursToMilliseconds(24))]);
    } catch (error) {
      // Alert?

      this.logger.error({ error, job });

      throw error;
    }
  }
}
