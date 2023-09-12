import { DataSource } from "typeorm";
import { ENV } from "../env";
import { entities } from "../../entities";

const migrationDir = __dirname.replace("configs/datasources", "migrations");

const PostgreSQLDataSource = new DataSource({
  type: "postgres",
  database: ENV.POSTGRES_DB,
  host: ENV.POSTGRES_HOST,
  port: ENV.POSTGRES_PORT,
  // schema: ENV.POSTGRES_SCHEMA,
  username: ENV.POSTGRES_USER,
  password: ENV.POSTGRES_PASSWORD,
  synchronize: false,
  maxQueryExecutionTime: 120 * 1000, // 2 Minutes
  logging: ENV.POSTGRES_DEBUG_MODE,
  migrations: [`${migrationDir}/**/*.ts`],
  extra: {
    max: 10,
  },
  entities,
});

export default PostgreSQLDataSource;
