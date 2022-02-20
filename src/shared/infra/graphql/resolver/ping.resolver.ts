import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Logger } from "src/shared/infra/logger/logger";
import { Resolver, Query, Mutation } from "type-graphql";
import { GetHotelAdapter } from "src/hotel-prices/infra/remote-api/get-hotel.adapter";
import { RemotePingService } from "src/hotel-prices/infra/remote-api/remote-ping.service.adapter";
import { PingResponseType } from "../types/ping-response.type";

@Resolver()
export class PingResolver {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  @Query(() => PingResponseType)
  async ping() {
    const id = 1;
    const remotePingService = new RemotePingService();
    let result = await remotePingService.execute();
    console.log(result);
    return {
      db: false,
      local_api: false,
      external_api: result.healthy,
    };
  }
}
