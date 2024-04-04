import { IncomingMessage, ServerResponse } from "http";
import { CustomException } from "./error";

export async function globalExceptionHandler(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  requestHandler: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => Promise<any>
) {
  try {
    await requestHandler(req, res);
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
