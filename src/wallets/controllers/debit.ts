import { IncomingMessage, ServerResponse } from "http";
import { WalletService } from "../services/wallets-service";

export const createDebit = (walletService: WalletService) => {
  return async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    res.end(JSON.stringify("test debit 123"));
  };
};
