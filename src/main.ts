import "reflect-metadata";
import { ApolloServerAdapter } from "src/shared/infra/apollo";
import { Orm } from "./shared/infra/typeorm";
import dotenv from "dotenv";
dotenv.config();

(async function () {
  await new Orm().execute();
  new ApolloServerAdapter();
})();
