import { parse as parseUrl, UrlWithParsedQuery } from "url";
import { createServer } from "http";
import { PageNotFound } from "./errors/error";
import { walletService } from "./di";
import { createGetBallance } from "./wallets/controllers/ballance";
import { createCredit } from "./wallets/controllers/credit";
import { createDebit } from "./wallets/controllers/debit";

const getBallanceReqHandler = createGetBallance(walletService);
const creditReqHandler = createCredit(walletService);
const debitReqHandler = createDebit(walletService);

const server = createServer(async (req, res) => {
  const parsedUrl: UrlWithParsedQuery = parseUrl(req.url, true);
  const path: string = parsedUrl.pathname;

  const pathSegments: string[] = path
    .split("/")
    .filter((value: string) => value.length > 0);
  const walletID = pathSegments[1];
  const walletOperation = pathSegments[2];

  if (pathSegments[0] !== "wallets") {
    throw new PageNotFound();
  }

  if (walletID && req.method === "GET") {
    getBallanceReqHandler(req, res);
    return;
  }

  if (walletOperation === "credit" && req.method === "POST") {
    // Credit
    creditReqHandler(req, res);
    return;
  }

  if (walletOperation === "debit" && req.method === "POST") {
    // Debit
    debitReqHandler(req, res);
    return;
  }

  throw new PageNotFound();
});

// starts a simple http server locally on port 3000
server.listen(8080, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
