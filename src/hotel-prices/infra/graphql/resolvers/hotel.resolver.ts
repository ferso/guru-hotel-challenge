import { GetHotelInsightsService } from "src/hotel-prices/application/services/get-hotel-insights.service";
import { GetHotelMetricsService } from "src/hotel-prices/application/services/get-hotel-metrics.service";
import { RemoteDataDTO } from "src/hotel-prices/dtos/fetch-remote.dto";
import { RoomType } from "src/shared/domain/enums/room-type";
import { AdminGuardAccess } from "src/shared/infra/graphql/middleware/admin.middleware";
import { isAuth } from "src/shared/infra/graphql/middleware/is-auth.middleware";
import { Logger } from "src/shared/infra/logger/logger";
import { Resolver, Query, Args, UseMiddleware, Authorized } from "type-graphql";
import { GetCompetitorsPricesAdapter } from "../../remote-api/get-competitors-prices.adapter";
import { GetHotelAdapter } from "../../remote-api/get-hotel.adapter";
import { GetHotelInsightsInputType } from "../types/get-hotel-insights.input.type";
import { GetHotelInsightsResponseType } from "../types/get-hotel-insights.response.type";
import { GetHotelMetricsInputType } from "../types/get-hotel-metrics.input.type";
import { GetHotelMetricsResponseType } from "../types/get-hotel-metrics.response.type";

@Resolver()
export class HotelResolver {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  @UseMiddleware(isAuth)
  @UseMiddleware(AdminGuardAccess)
  @Query(() => [GetHotelInsightsResponseType], {
    description: "Get Hotel insights",
    nullable: true,
  })
  async getHotelInsights(@Args() input: GetHotelInsightsInputType) {
    let result: any;
    const { hotel_id, period } = input;

    //use case service;
    const getHotelInsightsService = new GetHotelInsightsService();
    result = await getHotelInsightsService.cacheData(hotel_id);

    if (!result) {
      let fecthData: RemoteDataDTO = await getHotelInsightsService.fetch(
        hotel_id,
        period,
        new GetHotelAdapter(),
        new GetCompetitorsPricesAdapter()
      );
      // //retrive data from domain
      result = await getHotelInsightsService.execute(
        fecthData.hotel,
        fecthData.competitors
      );
    }
    return result;
  }

  @Query(() => [GetHotelMetricsResponseType], {
    description: "Get Hotel insights",
    nullable: true,
  })
  @UseMiddleware(isAuth)
  @UseMiddleware(AdminGuardAccess)
  async getHotelMetrics(@Args() input: GetHotelMetricsInputType) {
    let result: any;
    const { hotel_id, day, room_type } = input;

    //use case service;
    const getHotelMetricsService = new GetHotelMetricsService();
    result = await getHotelMetricsService.cacheData(
      hotel_id,
      day,
      room_type as any
    );

    if (!result) {
      let fecthData: RemoteDataDTO = await getHotelMetricsService.fetch(
        hotel_id,
        day,
        new GetHotelAdapter(),
        new GetCompetitorsPricesAdapter()
      );
      //retrive data from domain
      result = await getHotelMetricsService.execute(
        fecthData?.hotel,
        fecthData?.competitors
      );
    }

    return result;
  }
}
