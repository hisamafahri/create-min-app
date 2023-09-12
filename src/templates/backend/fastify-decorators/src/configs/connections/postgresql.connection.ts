import { DataSource } from "typeorm";
import { Service, Initializer, Destructor, Inject } from "fastify-decorators";
import { Logger } from "../../lib/utils/services/logger.service";
import PostgreSQLDataSource from "../datasources/postgresql.datasource";

@Service()
export class PostgreSQLConnection {
  connection!: DataSource;

  @Inject(Logger)
  protected logger: Logger;

  @Initializer()
  async init(): Promise<void> {
    try {
      this.connection = PostgreSQLDataSource;

      await this.connection.initialize();

      this.logger.info("[DB] Connected to the database");
    } catch (error) {
      this.logger.error(error, "[DB] Failed to connect to the database");
    }
  }

  @Destructor()
  async destroy(): Promise<void> {
    await this.connection.destroy();
  }
}
