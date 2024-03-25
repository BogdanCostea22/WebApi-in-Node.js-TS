import { IncomingMessage, ServerResponse } from "http";

export abstract class Controller {
  abstract basePath: string;
  abstract validate(path: string): boolean;
  abstract handleRequest(
    segmentsOfPath: string[],
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ): Promise<void>;
}
