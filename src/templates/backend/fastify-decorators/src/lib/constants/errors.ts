import createError from "@fastify/error";
import { LANGUAGE } from "./values";

const AUTH_FORBIDDEN = "AUTH_FORBIDDEN";

const AUTH_UNAUTHORIZED = "AUTH_UNAUTHORIZED";

const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

const ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND";

const TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS";

const BAD_REQUEST = "BAD_REQUEST";

export const ERR_AUTH_FORBIDDEN = createError(
  AUTH_FORBIDDEN,
  "request forbidden",
  403
);

export const ERR_AUTH_UNAUTHORIZED = createError(
  AUTH_UNAUTHORIZED,
  "request unauthorized",
  401
);

export const ERR_INTERNAL_SERVER = createError(
  INTERNAL_SERVER_ERROR,
  "internal server error",
  500
);

export const ERR_BAD_REQUEST = createError(BAD_REQUEST, "bad request", 400);

export const ERR_ENTITY_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  "entity was not found",
  404
);

export const ERR_TOO_MANY_REQUESTS = createError(
  TOO_MANY_REQUESTS,
  "too many requests",
  429
);
