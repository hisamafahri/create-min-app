import { Service } from "fastify-decorators";
import { BaseQueue } from "../../lib/common/queue";
import { SAMPLES_QUEUE } from "../../lib/constants/queue";
import { Samples } from "../../entities/public/samples.entity";

@Service()
export class SamplesQueue extends BaseQueue<Samples> {
  protected queueName = SAMPLES_QUEUE;
}
