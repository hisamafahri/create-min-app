import { Controller, GET, Inject } from "fastify-decorators";
import {
  CheckHealthResponse,
  checkHealthResponse,
} from "../schemas/health.schema";
import { HealthService } from "../services/health.service";

@Controller({ route: "/v1/health" })
export class HealthController {
  @Inject(HealthService)
  private healthService: HealthService;

  @GET({
    url: "/",
    options: {
      schema: {
        response: { 200: checkHealthResponse },
      },
    },
  })
  async checkHealth(): Promise<CheckHealthResponse> {
    const data = this.healthService.getHealthInfo();

    return {
      status: 200,
      message: "OK",
      data,
    };
  }
}
