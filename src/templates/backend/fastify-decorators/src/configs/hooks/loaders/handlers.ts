import { FastifyInstance } from "fastify";
import { getReqLanguage } from "../../../lib/utils/helper";
import { LANGUAGE } from "../../../lib/constants/values";
import { ENV } from "../../env";

export const registerHandlers = async (app: FastifyInstance) => {
  app.setErrorHandler((error, _, reply) => {
    let code = error.statusCode || 500;

    if (error.validation) {
      code = 400;
    }

    reply.status(code);
    reply.send({
      status: code,
      message: error.message,
      stack: ENV.isDev ? error.stack : undefined,
      data: null,
    });
  });

  app.setNotFoundHandler((request, reply) => {
    const lang = getReqLanguage(request);

    reply.status(404);
    reply.send({
      code: 404,
      message:
        lang === LANGUAGE.ID
          ? `Rute ${request.method}:${request.url} tidak ditemukan`
          : `Route ${request.method}:${request.url} is not found`,
      data: null,
    });
  });
};
