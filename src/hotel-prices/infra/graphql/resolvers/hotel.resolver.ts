import { GetHotelInsightsService } from "src/hotel-prices/application/services/get-hotel-insights.service";
import { GetHotelMetricsService } from "src/hotel-prices/application/services/get-hotel-metrics.service";
import { AdminGuardAccess } from "src/shared/infra/graphql/middleware/guard.middleware";
import { isAuth } from "src/shared/infra/graphql/middleware/is-auth.middleware";
import { Logger } from "src/shared/infra/logger/logger";
import { Resolver, Query, Args, UseMiddleware } from "type-graphql";
import { GetCompetitorsPricesAdapter } from "../../remote-api/get-competitors-prices.adapter";
import { GetHotelAdapter } from "../../remote-api/get-hotel.adapter";
import { GetHotelInsightsInputType } from "../types/get-hotel-insights.input.type";
import { GetHotelInsightsResponseType } from "../types/get-hotel-insights.response.type";
import { GetHotelMetricsResponseType } from "../types/get-hotel-metrics.response.type";

@Resolver()
export class HotelResolver {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
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
      //get hotels from remote
      const getHotelAdapter = new GetHotelAdapter();
      let hotel = await getHotelAdapter.execute(hotel_id);

      //get rooms prices from remote
      const getCompetitorsPricesAdapter = new GetCompetitorsPricesAdapter();
      let competitors = await getCompetitorsPricesAdapter.execute(
        hotel_id,
        period
      );
      //retrive data from domain
      result = await getHotelInsightsService.execute(hotel, competitors);
    }

    return result;
  }

  @Query(() => [GetHotelMetricsResponseType], {
    description: "Get Hotel insights",
    nullable: true,
  })
  @UseMiddleware(isAuth)
  @UseMiddleware(AdminGuardAccess)
  async getHotelMetrics(@Args() input: GetHotelInsightsInputType) {
    let result: any;
    const { hotel_id, period } = input;

    //use case service;
    const getHotelMetricsService = new GetHotelMetricsService();
    result = await getHotelMetricsService.cacheData(hotel_id);

    if (!result) {
      //get hotels from remote
      const getHotelAdapter = new GetHotelAdapter();
      let hotel = await getHotelAdapter.execute(hotel_id);

      //get rooms prices from remote
      const getCompetitorsPricesAdapter = new GetCompetitorsPricesAdapter();
      let competitors = await getCompetitorsPricesAdapter.execute(
        hotel_id,
        period
      );

      //retrive data from domain
      result = await getHotelMetricsService.execute(hotel);
    }

    // console.log(result);

    return result;
  }
}
