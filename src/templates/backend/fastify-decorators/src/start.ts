import { getInstanceByToken } from "fastify-decorators";
import figlet from "figlet";
import { app } from ".";
import { ENV } from "./configs/env";
import { Logger } from "./lib/utils/services/logger.service";
import { registerPlugins } from "./configs/hooks/loaders/plugins";
import { registerHooks } from "./configs/hooks/loaders/hooks";
import { registerHandlers } from "./configs/hooks/loaders/handlers";

const logger = getInstanceByToken<Logger>(Logger);

const start = async () => {
  try {
    await registerPlugins(app);

    await registerHooks(app);

    await registerHandlers(app);

    await app.ready();

    await app.listen({ port: ENV.CORE_PORT, host: ENV.CORE_HOST });

    figlet("sample", (_, data) => {
      /* eslint-disable-next-line no-console */
      console.info(data);
      logger.info(`
Mini core service start and listening at http://${ENV.CORE_HOST}:${ENV.CORE_PORT}
Logger is at: ${ENV.LOGGER}
Database is at: ${ENV.POSTGRES_PORT}
Central is at: ${ENV.CENTRAL_BASE_URL}
    `);
    });
  } catch (error) {
    logger.error(error);
    process.exit(-1);
  }
};

start();
