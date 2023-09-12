/* eslint-disable indent */
import { Controller, Inject } from "fastify-decorators";
import { RegularJobQueue } from "./queues/regular-job.queue";
import { RegularJobWorker } from "./workers/regular-job.worker";

import { SamplesWorker } from "./workers/samples.worker";

@Controller()
export class JobsController {
  @Inject(RegularJobQueue)
  regularJobQueue: RegularJobQueue;

  @Inject(RegularJobWorker)
  regularJobWorker: RegularJobWorker;

  // Others

  @Inject(SamplesWorker)
  samplesWorker: SamplesWorker;
}
