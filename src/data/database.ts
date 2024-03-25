import "reflect-metadata";
import { DataSource } from "typeorm";
import { WalletEntity } from "../wallets/repositories/entities/wallets-entity";
import { OperationEntity } from "../wallets/repositories/entities/operation-entity";
import { fetchDBConfiguration } from "../config";

const dbConfiguration = fetchDBConfiguration();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbConfiguration.url,
  port: dbConfiguration.port,
  username: dbConfiguration.username,
  password: dbConfiguration.password,
  database: dbConfiguration.name,
  entities: [WalletEntity, OperationEntity],
  synchronize: false,
  logging: dbConfiguration.logging,
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    console.log("Connected to the database....");
  })
  .catch((error) => console.error(error));
