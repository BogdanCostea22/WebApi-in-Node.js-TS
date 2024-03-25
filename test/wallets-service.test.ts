import { expect } from "chai";
import { WalletRepository } from "../src/wallets/repositories/wallets-repository";
import { OperationRepository } from "../src/wallets/repositories/operation-repository";
import {
  OperationEntity,
  OperationType,
} from "../src/wallets/repositories/entities/operation-entity";
import {
  DeniedOperation,
  DuplicatedOperation,
  MissingEntity,
} from "../src/errors/error";
import {
  WalletService,
  WalletServiceImpl,
} from "../src/wallets/services/wallets-service";
import { WalletEntity } from "../src/wallets/repositories/entities/wallets-entity";
import { OperationRequest } from "../src/wallets/controllers/dto/operation-model";
import { OperationResponse } from "../src/wallets/services/model/operation-model";

describe("Testing WalletsService", () => {
  let walletService: WalletService;
  let walletRepository: WalletRepository;
  let operationRepository: OperationRepository;
  let logger: any;

  beforeEach(() => {
    walletRepository = {
      find: () => Promise.resolve(null),
      getOrCreateWallet: () =>
        Promise.resolve({ id: "123", coins: 100 } as WalletEntity),
      updateBalance: () => Promise.resolve(),
    } as unknown as WalletRepository;

    operationRepository = {
      find: () => Promise.resolve(null),
      last: () => Promise.resolve({ transactionId: "456" }),
      create: () =>
        Promise.resolve({
          transactionId: "789",
          coins: 50,
          type: OperationType.CREDIT,
        }),
    } as unknown as OperationRepository;

    logger = {
      info: () => {},
    };

    walletService = new WalletServiceImpl(
      walletRepository,
      operationRepository,
      logger
    );
  });

  describe("getWallet", () => {
    it("should fetch wallet successfully", async () => {
      const walletId = "E95D6817-6080-46B4-8922-D1EB016BF59D";
      const walletEntity = createWalletEntity(walletId);
      const operationEntity = createOperationEntity();
      walletRepository.find = () => Promise.resolve(walletEntity);
      operationRepository.last = () => Promise.resolve(operationEntity);

      const wallet = await walletService.getWallet(walletId);

      expect(wallet).to.deep.equal({
        coins: walletEntity.coins,
        transactionId: operationEntity.transactionId,
        version: walletEntity.version,
      });
    });

    it("should throw MissingEntity error if wallet is not found", async () => {
      const walletId = "3809E623-CCF0-4853-9D59-C9DC0D072C42";
      walletRepository.find = () => Promise.resolve(null);

      try {
        await walletService.getWallet(walletId);
        expect.fail("Function should have thrown an error");
      } catch (error) {
        expect(error).to.be.instanceOf(MissingEntity);
      }
    });
  });

  describe("Crediting Wallet", () => {
    it("should credit the wallet successfully", async () => {
      const walletId = "123";
      const coins = 50;
      const transactionId = "456";
      const walletEntity = createWalletEntity(walletId);
      const operationEntity = createOperationEntity(coins, transactionId);

      walletRepository.find = () => Promise.resolve(walletEntity);
      operationRepository.create = () => Promise.resolve(operationEntity);

      const result = await walletService.creditWallet(
        walletId,
        coins,
        transactionId
      );
      expect(result).to.deep.equal({
        coins: 50,
        transactionId: "456",
      });
    });

    it("should throw DuplicatedOperation error if operation already exists", async () => {
      const walletId = "123";
      const coins = 50;
      const transactionId = "456";
      walletRepository.find = () =>
        Promise.resolve(createWalletEntity(walletId));
      operationRepository.find = () => Promise.resolve(createOperationEntity());

      try {
        await walletService.creditWallet(walletId, coins, transactionId);
        expect.fail("Function should have thrown an error");
      } catch (error) {
        expect(error).to.be.instanceOf(DuplicatedOperation);
      }
    });
  });

  describe("WalletServiceImpl - debit", () => {
    it("should debit the wallet successfully", async () => {
      const walletId = "48D39B6E-31CB-4F6F-83A7-AAE154D74034";
      const operationRequest: OperationRequest = {
        transactionId: "456",
        coins: 100,
      };
      const expectedOperationResponse: OperationResponse = {
        coins: 100,
        transactionId: "456",
      };

      const walletEntity = createWalletEntity(walletId, 1, 200);
      walletRepository.find = () => Promise.resolve(walletEntity);
      walletEntity.coins -= operationRequest.coins;
      walletEntity.version += 1;
      walletRepository.updateBalance = () => Promise.resolve(walletEntity);

      const operationEntity = createOperationEntity(
        operationRequest.coins,
        operationRequest.transactionId
      );
      operationRepository.find = () => Promise.resolve(null);
      operationRepository.create = () => Promise.resolve(operationEntity);

      // Call debit method
      const result = await walletService.debit(walletId, operationRequest);

      expect(result).to.deep.equal(expectedOperationResponse);

      // Assert that the walletRepository.updateBalance method was called with the correct arguments
      // expect(walletRepositoryMock.updateBalance.calledOnceWithExactly({ id: walletId, coins: 100 }, -50)).to.be.true;
    });

    it("should throw exception when operation was done before", async () => {
      const walletId = "48D39B6E-31CB-4F6F-83A7-AAE154D74034";
      const operationRequest: OperationRequest = {
        transactionId: "456",
        coins: 100,
      };

      const walletEntity = createWalletEntity(walletId, 1, 200);
      walletRepository.find = () => Promise.resolve(walletEntity);

      const operationEntity = createOperationEntity(
        operationRequest.coins,
        operationRequest.transactionId
      );
      operationRepository.find = () => Promise.resolve(operationEntity);

      // Call debit method and expect it to throw DuplicatedOperation error
      try {
        await walletService.debit(walletId, operationRequest);
        expect.fail("Function should have thrown an error");
      } catch (error) {
        expect(error).to.be.instanceOf(DuplicatedOperation);
      }
    });

    it("should throw exception when withdrawing more than the current ballance", async () => {
      const walletId = "48D39B6E-31CB-4F6F-83A7-AAE154D74034";
      const operationRequest: OperationRequest = {
        transactionId: "456",
        coins: 100,
      };

      const walletEntity = createWalletEntity(walletId, 1, 50);
      walletRepository.find = () => Promise.resolve(walletEntity);
      operationRepository.find = () => Promise.resolve(null);

      // Call debit method and expect it to throw DeniedOperation error
      try {
        await walletService.debit(walletId, operationRequest);
        expect.fail("Function should have thrown an error");
      } catch (error) {
        expect(error).to.be.instanceOf(DeniedOperation);
      }
    });

    it("should throw MissingEntity error if wallet is not found", async () => {
      const walletId = "123";
      const operationRequest: OperationRequest = {
        transactionId: "456",
        coins: 50,
      };

      walletRepository.find = () => Promise.resolve(null);

      // Call debit method and expect it to throw MissingEntity error
      try {
        await walletService.debit(walletId, operationRequest);
        expect.fail("Function should have thrown an error");
      } catch (error) {
        expect(error).to.be.instanceOf(MissingEntity);
      }
    });
  });
});

function createOperationEntity(
  coins: number = Math.random(),
  transactionId: string = Math.random().toString()
): OperationEntity {
  const operation = new OperationEntity();
  operation.transactionId = transactionId;
  operation.coins = coins;
  return operation;
}

function createWalletEntity(
  walletId: string,
  version: number = Math.random(),
  coins: number = Math.random()
): WalletEntity {
  const wallet = new WalletEntity();
  wallet.coins = coins;
  wallet.version = version;
  wallet.id = walletId;

  return wallet;
}
