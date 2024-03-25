import { DataSource } from "typeorm";
import { WalletEntity } from "./entities/wallets-entity";
import { Logger } from "pino";

export interface WalletRepository {
  save(wallet: WalletEntity): Promise<WalletEntity>;
  updateBalance(
    walletEntity: WalletEntity,
    coins: number
  ): Promise<WalletEntity>;
  find(walletId: string): Promise<WalletEntity>;
  getOrCreateWallet(walletId: string): Promise<WalletEntity>;
}

export class WalletRepositoryImpl implements WalletRepository {
  private datasource: DataSource;
  private logger: Logger<never>;

  constructor(appDatasource: DataSource, logger: Logger<never>) {
    this.datasource = appDatasource;
    this.logger = logger;
  }

  updateBalance(
    walletEntity: WalletEntity,
    coins: number
  ): Promise<WalletEntity> {
    walletEntity.coins += coins;
    walletEntity.version += 1;
    return this.save(walletEntity);
  }

  save(wallet: WalletEntity): Promise<WalletEntity> {
    return this.datasource.manager.save(wallet);
  }

  find(walletId: string): Promise<WalletEntity> {
    return this.datasource.manager
      .getRepository(WalletEntity)
      .findOneBy({ id: walletId });
  }

  async getOrCreateWallet(walletId: string): Promise<WalletEntity> {
    let walletEntity = await this.find(walletId);
    if (walletEntity == null) {
      walletEntity = new WalletEntity();
      walletEntity.id = walletId;
      walletEntity.coins = 0;
      walletEntity.version = 0;
      walletEntity = await this.save(walletEntity);
    }

    return walletEntity;
  }
}
