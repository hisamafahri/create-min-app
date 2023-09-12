import { FastifyInstance } from "fastify";
import { getInstanceByToken } from "fastify-decorators";
import { Logger } from "../../../lib/utils/services/logger.service";

const logger = getInstanceByToken<Logger>(Logger);

export const registerHooks = async (app: FastifyInstance) => {
  app.addHook("preValidation", (req, _, done) => {
    logger.info({
      timestamp: new Date(),
      requestId: req.id,
      logLevel: "info",
      ctx: "request-log",
      message: `[${req.id}] Start...`,
      request: {
        method: req.method.toUpperCase(),
        url: req.routerPath,
        // headers: req.headers,
        params: req.params,
        querystring: req.query,
        body: req.body,
      },
    });

    done();
  });

  app.addHook("onResponse", (req, reply, done) => {
    logger.info({
      timestamp: new Date(),
      requestId: req.id,
      logLevel: "info",
      ctx: "response-log",
      message: `[${req.id}] End!`,
      response: {
        statusCode: reply.statusCode,
        responseTime: reply.getResponseTime(),
      },
    });

    done();
  });
};
