import { expect } from 'chai';
import sinon from 'sinon';
import { WalletsController } from '../src/wallets/controllers/wallets-controller';
import { WalletService } from '../src/wallets/services/wallets-service';
import { InvalidFormat } from '../src/errors/error';
import { OperationRequest } from '../src/wallets/controllers/dto/operation-model';
import { Wallet } from '../src/wallets/services/model/wallet-model';
import { Logger } from 'pino';

describe('WalletsController', () => {
  let walletsController: WalletsController;
  let walletServiceMock: sinon.SinonStubbedInstance<WalletService>;
  let loggerMock: sinon.SinonStubbedInstance<Logger<never>>;

  beforeEach(() => {
    walletServiceMock =  sinon.stub({
        getWallet: () => Promise.resolve(null),
        creditWallet: () => Promise.resolve(null),
        debit: () => Promise.resolve(null)
    } as unknown as WalletService);
    loggerMock = sinon.stub ({
        debug: () => {}
    } as unknown as Logger<never>)

    walletsController = new WalletsController(walletServiceMock as unknown as WalletService, loggerMock);
  });

  it('should validate path correctly', () => {
    const validPath = '/wallets/123';
    const invalidPath = '/transactions/123';

    expect(walletsController.validate(validPath)).to.be.true;
    expect(walletsController.validate(invalidPath)).to.be.false;
  });

  it('should handle request for getting wallet', async () => {
    const segmentsOfPath = ['/wallets', '751155A9-0FEA-4FE2-BEC3-EB6882F054FD'];
    const req = {} as any;
    const res = { end: sinon.stub(), writeHead: sinon.stub() } as any;
    const expectedResponse: Wallet = { transactionId: '751155A9-0FEA-4FE2-BEC3-EB6882F054FD', coins: 100, version: 1} as Wallet; 

    walletServiceMock.getWallet.resolves(expectedResponse);
    await walletsController.handleRequest(segmentsOfPath, req, res);

    sinon.assert.calledWithExactly(walletServiceMock.getWallet, '751155A9-0FEA-4FE2-BEC3-EB6882F054FD');
    sinon.assert.calledWithExactly(res.writeHead, 200, { 'Content-Type': 'text/plain' });
    sinon.assert.calledWithExactly(res.end, JSON.stringify(expectedResponse));
  });
});



