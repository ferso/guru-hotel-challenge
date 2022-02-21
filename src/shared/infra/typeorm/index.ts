import path from "path";
import fs from "fs";
import { createConnection } from "typeorm";
import { Logger } from "../logger/logger";

export class Orm {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
    return this;
  }
  async execute(next?: Function): Promise<Orm> {
    return new Promise(async (resolve, reject) => {
      try {
        createConnection().then(async (connection) => {
          globalThis.connection = connection;
          this.logger.logger.info("DATABASE CONECTION DONE");
          next();
          return resolve(this);
        });
        return resolve(this);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
