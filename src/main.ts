import "reflect-metadata";
import { ApolloServerAdapter } from "src/shared/infra/apollo";
import { Orm } from "./shared/infra/typeorm";
import dotenv from "dotenv";
import { SeedService } from "./shared/application/services/seed.service";
dotenv.config();

(async function () {
  await new Orm().execute(async () => {
    let seed = new SeedService();
    await seed.execute();
  });
  await new ApolloServerAdapter().start();
})();
