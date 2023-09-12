/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable comma-dangle */
import { Service } from "fastify-decorators";
import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from "typeorm";
import { PostgreSQLConnection } from "../../configs/connections/postgresql.connection";

@Service()
export abstract class BaseFacade<T extends ObjectLiteral = BaseEntity> {
  protected psql!: PostgreSQLConnection;

  protected repository: Repository<T>;

  abstract init(): void;
}

@Service()
export abstract class BaseSQLFacade<
  T extends ObjectLiteral = BaseEntity
> extends BaseFacade<T> {
  async getOne(params: FindOneOptions<T>): Promise<T | null> {
    const entity = await this.repository.findOne(params);

    return entity;
  }

  async getOneWithTx(
    params: FindOneOptions<T>,
    queryRunner: QueryRunner
  ): Promise<T | null> {
    let query = this.repository
      .createQueryBuilder("e", queryRunner)
      .select("*");

    if (params.where) {
      query = query.where(params.where);
    }

    const entity = await query.getOne();

    return entity;
  }

  async getMany(params: FindManyOptions<T>): Promise<[T[], number]> {
    const [entities, count] = await this.repository.findAndCount(params);

    return [entities, count];
  }

  async count(params: FindManyOptions<T>): Promise<number> {
    const count = await this.repository.count(params);

    return count;
  }

  async createOne(data: DeepPartial<T>): Promise<T> {
    const toBeEntity = {
      ...data,
    };

    const entity = this.repository.create(toBeEntity);

    const createdEntity = await this.repository.save(entity);

    return createdEntity;
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.repository.create(
      data.map<DeepPartial<T>>((d) => ({
        ...d,
      }))
    );

    const createdEntities = await this.repository.save(entities);

    return createdEntities;
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner = this.psql.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    return queryRunner;
  }

  async commitTransaction(
    queryRunner: QueryRunner,
    release = true
  ): Promise<void> {
    if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
    }

    if (release) {
      await queryRunner.release();
    }
  }

  async rollbackTransaction(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    await queryRunner.release();
  }
}
