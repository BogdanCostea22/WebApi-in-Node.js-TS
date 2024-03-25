import { config } from "dotenv";
import { resolve } from "path";

export class DbConfig {
  port: number;
  url: string;
  name: string;
  username: string;
  password: string;
  logging: boolean;
}

export interface ServerConfig {
  level: string;
  port: number;
}

config({ path: `${resolve(__dirname, "../")}/config.env` });
export function fetchDBConfiguration(): DbConfig {
  return {
    port: Number(process.env.DB_PORT),
    url: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    logging: Boolean(process.env.DB_LOGGING),
  };
}

export function fetchServerConfig(): ServerConfig {
  return {
    port: Number(process.env.PORT),
    level: process.env.LEVEL,
  };
}
