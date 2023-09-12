import { Inject, Service, Initializer } from "fastify-decorators";
import { PostgreSQLConnection } from "../../configs/connections/postgresql.connection";
import { BaseSQLFacade } from "../../lib/common/facade";
import { Logger } from "../../lib/utils/services/logger.service";
import { Samples } from "../../entities/public/samples.entity";

@Service()
export class SamplesFacade extends BaseSQLFacade<Samples> {
  @Inject(PostgreSQLConnection)
  protected psql: PostgreSQLConnection;

  @Inject(Logger)
  protected logger: Logger;

  @Initializer([PostgreSQLConnection])
  async init(): Promise<void> {
    this.repository = this.psql.connection.getRepository(Samples);
  }
}
