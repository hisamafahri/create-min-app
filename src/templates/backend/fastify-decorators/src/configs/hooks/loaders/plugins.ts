import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { bootstrap } from "fastify-decorators";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";

import { controllers } from "../../../controllers";

export const registerPlugins = async (app: FastifyInstance) => {
  // TODO: implement stricter cors policy?
  app.register(cors, { origin: true });
  app.register(helmet);

  app.register(cookie, {
    secret: "my-secret",
  } as FastifyCookieOptions);

  app.register(bootstrap, {
    controllers,
  });
};
