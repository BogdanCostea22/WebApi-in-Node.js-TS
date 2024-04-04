import { parse as parseUrl, UrlWithParsedQuery } from "url";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { PageNotFound } from "./errors/error";
import { globalExceptionHandler } from "./errors/global-exception-handler";
import { walletsController } from "./di";
import {
  WALLET_CREDIT_OPERATION,
  WALLET_DEBIT_OPERATION,
} from "./wallets/controllers/wallets-controller";

const server = createServer(async (req, res) => {
  const parsedUrl: UrlWithParsedQuery = parseUrl(req.url, true);
  const path: string = parsedUrl.pathname;

  const pathSegments: string[] = path
    .split("/")
    .filter((value: string) => value.length > 0);
  const walletID = pathSegments[1];
  const walletOperation = pathSegments[2];

  if (pathSegments[0] !== walletsController.basePath) {
    throw new PageNotFound();
  }

  if (walletID && req.method === 'GET') {
    //Get Wallet
  }
  if (walletOperation === WALLET_CREDIT_OPERATION && req.method === "POST") {
    // Credit
  }

  if (walletOperation === WALLET_DEBIT_OPERATION && req.method === "POST") {
    // Debit
  }

  throw new PageNotFound();
});

// starts a simple http server locally on port 3000
server.listen(8080, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
