import { Wallet } from "./model/wallet-model";
import { WalletRepository } from "../repositories/wallets-repository";
import {
  convertToDomainModel,
  convertToOperationResponse,
} from "./model/wallet-mappers";
import { OperationRepository } from "../repositories/operation-repository";
import {
  DeniedOperation,
  DuplicatedOperation,
  MissingEntity,
} from "../../errors/error";
import { OperationResponse } from "./model/operation-model";
import { WalletEntity } from "../repositories/entities/wallets-entity";
import { OperationRequest } from "../controllers/dto/operation-model";
import { OperationType } from "../repositories/entities/operation-entity";
import { Logger } from "pino";

export interface WalletService {
  getWallet(walletId: string): Promise<Wallet>;
  creditWallet(
    walletId: string,
    coins: number,
    transactionId: string
  ): Promise<OperationResponse>;
  debit(
    walletId: string,
    operationRequest: OperationRequest
  ): Promise<OperationResponse>;
}

export class WalletServiceImpl implements WalletService {
  private walletRepository: WalletRepository;
  private logger: Logger<never>;
  private operationRepository: OperationRepository;

  constructor(
    walletRepository: WalletRepository,
    operationRepository: OperationRepository,
    logger: Logger<never>
  ) {
    this.logger = logger;
    this.walletRepository = walletRepository;
    this.operationRepository = operationRepository;
  }

  async getWallet(walletId: string): Promise<Wallet> {
    this.logger.info({ walletId: walletId }, "Fetching wallet...");
    const wallet = await this.walletRepository
      .find(walletId)
      .then(this.interpretResponse);
    const lastOperation = await this.operationRepository.last(walletId);
    wallet.transactionId = lastOperation.transactionId;
    return wallet;
  }

  private interpretResponse(response: WalletEntity | null): Wallet {
    if (response == null) {
      throw new MissingEntity();
    }

    return convertToDomainModel(response);
  }

  async creditWallet(
    walletId: string,
    coins: number,
    transactionId: string
  ): Promise<OperationResponse> {
    this.logger.info({ walletId: walletId }, "Adding credit to wallet...");
    const wallet = await this.walletRepository.getOrCreateWallet(walletId);
    const walletOperation = await this.operationRepository.find(
      walletId,
      transactionId
    );
    if (walletOperation != null) {
      throw new DuplicatedOperation();
    }

    await this.walletRepository.updateBalance(wallet, coins);
    return this.operationRepository
      .create(wallet.id, coins, transactionId, OperationType.CREDIT)
      .then(convertToOperationResponse);
  }

  async debit(
    walletId: string,
    operationRequest: OperationRequest
  ): Promise<OperationResponse> {
    this.logger.info(
      { walletId: walletId },
      "Withdrawing credit from wallet..."
    );
    const wallet = await this.walletRepository.find(walletId);
    const operation = await this.operationRepository.find(
      walletId,
      operationRequest.transactionId
    );

    switch (true) {
      case wallet == null: {
        throw new MissingEntity();
      }
      case operation != null: {
        throw new DuplicatedOperation();
      }
      case wallet.coins < operationRequest.coins: {
        this.logger.info({ walletId: walletId }, "Not enough funds...");
        throw new DeniedOperation("Denied operation, not enough money!");
      }
      default: {
        this.walletRepository.updateBalance(wallet, -operationRequest.coins);
        return this.operationRepository
          .create(
            wallet.id,
            operationRequest.coins,
            operationRequest.transactionId,
            OperationType.DEBIT
          )
          .then(convertToOperationResponse);
      }
    }
    return;
  }
}
