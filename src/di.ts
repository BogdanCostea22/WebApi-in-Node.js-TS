import { AppDataSource } from "./data/database";
import { pinoLogger } from "./utils/logger";
import { WalletsController } from "./wallets/controllers/wallets-controller";
import {
  OperationRepository,
  OperationRepositoryImpl,
} from "./wallets/repositories/operation-repository";
import {
  WalletRepository,
  WalletRepositoryImpl,
} from "./wallets/repositories/wallets-repository";
import {
  WalletService,
  WalletServiceImpl,
} from "./wallets/services/wallets-service";

const walletRepository: WalletRepository = new WalletRepositoryImpl(
  AppDataSource,
  pinoLogger
);
const operationRepository: OperationRepository = new OperationRepositoryImpl(
  AppDataSource,
  pinoLogger
);
const walletService: WalletService = new WalletServiceImpl(
  walletRepository,
  operationRepository,
  pinoLogger
);

export const walletsController = new WalletsController(
  walletService,
  pinoLogger
);
