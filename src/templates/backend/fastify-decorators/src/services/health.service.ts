import { Service } from "fastify-decorators";
import { secondsToDurationText } from "../lib/utils/helper";
import pkg from "../../package.json";
import { HealthResponseItem } from "../schemas/health.schema";

@Service()
export class HealthService {
  // eslint-disable-next-line class-methods-use-this
  getHealthInfo(): HealthResponseItem {
    return {
      service: {
        name: pkg.name,
        version: `v${pkg.version}`,
      },
      uptime: secondsToDurationText(process.uptime()),
      date: new Date().toISOString(),
      status: "OK",
    };
  }
}
