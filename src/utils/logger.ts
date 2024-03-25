import pino, { Logger } from "pino";
import { fetchServerConfig } from "../config";

// Create a Pino pinoLogger instance
const DEFAULT_LOG_LEVEL = "info";
export const pinoLogger: Logger<never> = pino({
  level: fetchServerConfig().level ?? DEFAULT_LOG_LEVEL, // Set logging level
});
