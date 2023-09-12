import { Inject, Service } from "fastify-decorators";
import { BaseWorker } from "../../lib/common/worker";
import { Logger } from "../../lib/utils/services/logger.service";
import { SAMPLES_QUEUE } from "../../lib/constants/queue";
import { Samples } from "../../entities/public/samples.entity";

@Service()
export class SamplesWorker extends BaseWorker<Samples> {
  @Inject(Logger)
  private logger: Logger;

  protected workerName = SAMPLES_QUEUE;

  protected async handle(data: Samples) {
    try {
      // const result = await this.sampleService.updateLocker(data);

      return data as unknown as undefined;
    } catch (error) {
      this.logger.error(error);

      // TODO: Alert?

      throw error;
    }
  }
}
