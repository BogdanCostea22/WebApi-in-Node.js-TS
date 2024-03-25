import { IncomingMessage, ServerResponse } from "http";
import { CustomException } from "./error";

export async function globalExceptionHandler(
  action: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => Promise<any>,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) {
  try {
    await action(req, res);
  } catch (exc: any) {
    console.log("Caught exception", exc);
    switch (true) {
      case exc instanceof CustomException: {
        res.writeHead(exc.statusCode, { "Content-Type": "text/plain" }); // Set headers
        res.end(JSON.stringify(exc));
        break;
      }
    }
  }
}
