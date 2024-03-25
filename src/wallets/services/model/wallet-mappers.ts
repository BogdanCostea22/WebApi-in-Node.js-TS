import { OperationEntity } from "../../repositories/entities/operation-entity";
import { WalletEntity } from "../../repositories/entities/wallets-entity";
import { OperationResponse } from "./operation-model";
import { Wallet } from "./wallet-model";

export function convertToDomainModel(walletEntity: WalletEntity): Wallet {
  return {
    transactionId: walletEntity.id,
    version: walletEntity.version,
    coins: walletEntity.coins,
  };
}

export function convertToOperationResponse(
  operationEntity: OperationEntity
): OperationResponse {
  return new OperationResponse(
    operationEntity.transactionId,
    operationEntity.coins
  );
}
