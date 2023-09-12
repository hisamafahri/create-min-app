import { bool, cleanEnv, num, port, str } from "envalid";

export const ENV = cleanEnv(process.env, {
  // PostgreSQL Database
  POSTGRES_DB: str(),
  POSTGRES_HOST: str(),
  POSTGRES_PORT: num(),
  POSTGRES_SCHEMA: str(),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DEBUG_MODE: bool({ default: false }),

  // Redis
  REDIS_URL: str(),
  REDIS_PORT: port(),
  REDIS_PASSWORD: str(),

  // Services
  CORE_HOST: str(),
  CORE_PORT: num(),
  LOGGER: str({ choices: ["cloud", "local"], default: "local" }),
  TZ: str({ default: "utc" }),
  HUB_ID: str(),

  // Central
  CENTRAL_BASE_URL: str(),

  // Environments
  NODE_ENV: str({
    choices: ["development", "test", "production", "staging"],
    default: "development",
  }),
});
