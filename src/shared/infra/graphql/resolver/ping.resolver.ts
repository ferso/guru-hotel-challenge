import { Logger } from "src/shared/infra/logger/logger";
import {
  Resolver,
  Query,
  Mutation,
  UseMiddleware,
  Authorized,
} from "type-graphql";
import { PingResponseType } from "../types/ping-response.type";

import { PingService } from "src/hotel-prices/application/services/ping.service";
import { Service } from "typedi";

@Resolver()
@Service()
export class PingResolver {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  @Authorized(["user", "admin"])
  @Query(() => PingResponseType)
  async ping() {
    const pingService = new PingService();
    return await pingService.execute().catch(() => null);
  }
}
