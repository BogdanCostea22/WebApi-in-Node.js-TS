import { parse as parseUrl, UrlWithParsedQuery } from "url";
import { IncomingMessage, ServerResponse } from "http";
import { WalletService } from "../services/wallets-service";
import { parseRequestBody, sendResponse } from "../../utils/utils";
import { OperationRequest } from "./dto/operation-model";

export const createCredit = (walletService: WalletService) => {
  return async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    const body = (await parseRequestBody(req)) as OperationRequest;

    const parsedUrl: UrlWithParsedQuery = parseUrl(req.url, true);
    const path: string = parsedUrl.pathname;
    const pathSegments: string[] = path
      .split("/")
      .filter((value: string) => value.length > 0);
    const walletID = pathSegments[1];

    const actionResponse = await walletService.creditWallet(
      walletID,
      body.coins,
      body.transactionId
    );
    
    sendResponse(actionResponse, res, 201);
  };
};
