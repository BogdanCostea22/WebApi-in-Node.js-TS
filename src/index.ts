import { parse as parseUrl, UrlWithParsedQuery } from "url";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { PageNotFound } from "./errors/error";
import { globalExceptionHandler } from "./errors/global-exception-handler";
import { walletsController } from "./di";

const server = createServer(async (req, res) => {
  globalExceptionHandler(definePaths, req, res);
});

async function definePaths(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
): Promise<any> {
  const parsedUrl: UrlWithParsedQuery = parseUrl(req.url, true);
  const path: string = parsedUrl.pathname;
  const pathSegments: string[] = path
    .split("/")
    .filter((value: string) => value.length > 0); // Split the path by '/'

  switch (pathSegments[0]) {
    case walletsController.basePath: {
      await walletsController.handleRequest(pathSegments, req, res);
      break;
    }
    default: {
      throw new PageNotFound();
    }
  }

  return;
}

// starts a simple http server locally on port 3000
server.listen(8080, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
