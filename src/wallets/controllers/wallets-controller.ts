import { IncomingMessage, ServerResponse } from "http";
import { Controller } from "../../controller";
import { parseRequestBody, validateUUID } from "../../utils/utils";
import { WalletService, WalletServiceImpl } from "../services/wallets-service";
import { InvalidFormat } from "../../errors/error";
import { OperationRequest } from "./dto/operation-model";
import { Logger } from "pino";

const WALLETS_PATH: string = "wallets";
export const WALLET_DEBIT_OPERATION = "debit";
export const WALLET_CREDIT_OPERATION = "credit";
type validator = (segments: string[]) => boolean;
type action = (walletId: string, resp: ServerResponse<IncomingMessage>) => void;

export class WalletsController extends Controller {
  basePath: string = WALLETS_PATH;
  private walletsService: WalletService;
  private logger: Logger<never>;

  constructor(walletsService: WalletService, logger: Logger<never>) {
    super();
    this.walletsService = walletsService;
    this.logger = logger;
  }

  validate(path: string): boolean {
    return path.includes(WALLETS_PATH);
  }

  async handleRequest(
    segmentsOfPath: string[],
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ): Promise<void> {
    // Extract values from the path
    this.logger.debug("Entered in wallets controler");
    const walletID = segmentsOfPath[1]; // walletid should be after /wallets/{walletId}
    const walletOperation = segmentsOfPath[2]; // the operations on the wallet should be the third parameter in the path /wallets/walletId/walletOperation
    const isValidUUID = validateUUID(walletID);
    switch (true) {
      case !isValidUUID: {
        throw new InvalidFormat("Invalid wallet UUID!");
        break;
      }

      case segmentsOfPath.length == 2: {

        break;
      }

      case walletOperation === WALLET_CREDIT_OPERATION &&
        req.method === "POST": {
        const body = (await parseRequestBody(req)) as OperationRequest;
        const actionResponse = await this.walletsService.creditWallet(
          walletID,
          body.coins,
          body.transactionId
        );
        this.formatReponse(actionResponse, res, 201);
        break;
      }

      case walletOperation === WALLET_DEBIT_OPERATION &&
        req.method === "POST": {
        const body = (await parseRequestBody(req)) as OperationRequest;
        const actionResponse = await this.walletsService.debit(walletID, body);
        this.formatReponse(actionResponse, res, 201);
        break;
      }

      default: {
        res.writeHead(404, { "Content-Type": "text/plain" }); // Set headers
        res.end("Operation not implemented yet!");
      }
    }
    return;
  }

  private formatReponse(
    actionResponse: any,
    res: ServerResponse<IncomingMessage>,
    code: number
  ) {
    res.writeHead(code, { "Content-Type": "text/plain" }); // Set headers
    res.end(JSON.stringify(actionResponse));
  }
}
