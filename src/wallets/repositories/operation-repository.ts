import { DataSource } from "typeorm";
import { OperationEntity, OperationType } from "./entities/operation-entity";
import { Logger } from "pino";

export interface OperationRepository {
  save(operationEntity: OperationEntity): Promise<OperationEntity>;
  create(
    walletId: string,
    coins: number,
    transactionId: String,
    type: OperationType
  ): Promise<OperationEntity>;
  find(walletId: string, transactionId: string): Promise<OperationEntity>;
  last(walletId: string): Promise<OperationEntity>;
}

export class OperationRepositoryImpl implements OperationRepository {
  private datasource: DataSource;
  private logger: Logger<never>;

  constructor(dataSource: DataSource, logger: Logger<never>) {
    this.datasource = dataSource;
    this.logger = logger;
  }

  last(walletId: string): Promise<OperationEntity> {
    return this.datasource.getRepository(OperationEntity).findOne({
      where: { walletId: walletId },
      order: { createdAt: "DESC" },
    });
  }

  create(
    walletId: string,
    coins: number,
    transactionId: string,
    type: OperationType
  ): Promise<OperationEntity> {
    const operationEntity = new OperationEntity();
    operationEntity.transactionId = transactionId;
    operationEntity.walletId = walletId;
    operationEntity.type = type;
    operationEntity.coins = coins;
    return this.save(operationEntity);
  }

  save(operationEntity: OperationEntity): Promise<OperationEntity> {
    return this.datasource.manager.save(operationEntity);
  }

  find(walletId: string, transactionId: string): Promise<OperationEntity> {
    return this.datasource.getRepository(OperationEntity).findOneBy({
      walletId: walletId,
      transactionId: transactionId,
    });
  }
}
