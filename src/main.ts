import "reflect-metadata";

import { ApolloServerAdapter } from "src/shared/infra/apollo";
import { Orm } from "./shared/infra/typeorm";
import { Container } from "typedi";
import dotenv from "dotenv";
import { SeedService } from "./shared/application/services/seed.service";
import path from "path";
dotenv.config({ path: path.resolve(`./.env.${process.env.ENV}`) });

(async function () {
  await new Orm().execute(async () => {
    let seed = new SeedService();
    await seed.execute();
  });
  await new ApolloServerAdapter().start();
})();
