import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Logger } from "src/shared/infra/logger/logger";
import { Resolver, Query, Mutation, UseMiddleware } from "type-graphql";
import { RemotePingService } from "src/hotel-prices/infra/remote-api/remote-ping.service.adapter";
import { PingResponseType } from "../types/ping-response.type";
import { UserGuardAccess } from "../middleware/user-guard.middleware";
import { isAuth } from "../middleware/is-auth.middleware";
import { AdminGuardAccess } from "../middleware/admin.middleware";
import { PingDatabaseStatus } from "src/hotel-prices/application/services/ping.database.service";

@Resolver()
export class PingResolver {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  @UseMiddleware(isAuth)
  @UseMiddleware(UserGuardAccess)
  @Query(() => PingResponseType)
  async ping() {
    const id = 1;

    const pingService = new PingDatabaseStatus();
    let pingMongo = await pingService.execute();

    const remotePingService = new RemotePingService();
    let result = await remotePingService.execute();

    return {
      db: pingMongo,
      local_api: true,
      external_api: result.healthy,
    };
  }
}
