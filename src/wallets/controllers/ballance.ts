import { parse as parseUrl, UrlWithParsedQuery } from "url";
import { IncomingMessage, ServerResponse } from "http";
import { WalletService } from "../services/wallets-service";
import { sendResponse } from "../../utils/utils";


export const createGetBallance = (walletService: WalletService) => {
  return async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    const parsedUrl: UrlWithParsedQuery = parseUrl(req.url, true);
    const path: string = parsedUrl.pathname;
    const pathSegments: string[] = path
      .split("/")
      .filter((value: string) => value.length > 0);
    const walletID = pathSegments[1];

    const actionResponse = await walletService.getWallet(
      walletID
    );
    
    sendResponse(actionResponse, res, 201);
  };
};
