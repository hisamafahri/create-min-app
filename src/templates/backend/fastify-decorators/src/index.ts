import "reflect-metadata";

import { randomUUID } from "crypto";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fastify } from "fastify";

import { ENV } from "./configs/env";

export const app = fastify({
  pluginTimeout: 90_000,
  genReqId: () => randomUUID(),
  logger: ENV.LOGGER === "local" && {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  disableRequestLogging: true,
  trustProxy: true,
}).withTypeProvider<TypeBoxTypeProvider>();
