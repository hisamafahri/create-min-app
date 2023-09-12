import { Initializer, Service } from "fastify-decorators";
import * as IORedis from "ioredis";
import { ENV } from "../env";

@Service()
export class RedisConnection {
  client: IORedis.Redis;

  @Initializer()
  init() {
    this.client = new IORedis.Redis({
      host: ENV.REDIS_URL,
      port: ENV.REDIS_PORT,
      password: ENV.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    });
    this.client.setMaxListeners(9999);
  }

  async set(key: string, value: string, ex?: number) {
    const data = await this.client.set(key, value, "EX", ex || 60); // In seconds
    return data;
  }

  async get(key: string) {
    const data = await this.client.get(key);
    return data;
  }

  async del(key: string) {
    const data = await this.client.del(key);
    return data;
  }
}
