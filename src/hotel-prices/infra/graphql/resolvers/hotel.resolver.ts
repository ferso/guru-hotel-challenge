import { Service } from "typedi";

import { Logger } from "src/shared/infra/logger/logger";
import { GetHotelInsightsService } from "src/hotel-prices/application/services/get-hotel-insights.service";
import { GetHotelMetricsService } from "src/hotel-prices/application/services/get-hotel-metrics.service";
import {
  Resolver,
  Query,
  Args,
  Authorized,
  Directive,
  UseMiddleware,
  Ctx,
} from "type-graphql";

import { GetHotelInsightsInputType } from "../types/get-hotel-insights.input.type";
import { GetHotelInsightsResponseType } from "../types/get-hotel-insights.response.type";
import { GetHotelMetricsInputType } from "../types/get-hotel-metrics.input.type";
import { GetHotelMetricsResponseType } from "../types/get-hotel-metrics.response.type";
import { RoomType } from "src/shared/domain/enums/room-type";
import { RolesType } from "src/shared/domain/enums/roles-type";

@Service()
@Resolver()
export class HotelResolver {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  @Authorized([RolesType.admin])
  @Query(() => [GetHotelInsightsResponseType], {
    description: "Get Hotel insights",
    nullable: true,
  })
  async getHotelInsights(@Args() input: GetHotelInsightsInputType) {
    let result: any;

    //get inputs
    const { hotel_id, period, limit } = input;

    //use case service;
    const getHotelInsightsService = new GetHotelInsightsService();
    result = await getHotelInsightsService.execute(hotel_id, period, limit);
    return result;
  }

  @Authorized([RolesType.admin])
  @Query(() => [GetHotelMetricsResponseType], {
    description: "Get Hotel insights",
    nullable: true,
  })
  async getHotelMetrics(
    @Args() input: GetHotelMetricsInputType,
    @Ctx() ctx: any
  ) {
    let result: any;
    const { hotel_id, day, room_type } = input;
    //use case service;
    const getHotelMetricsService = new GetHotelMetricsService();
    //retrive data from domain
    result = await getHotelMetricsService.execute(
      hotel_id,
      day,
      room_type as RoomType
    );

    return result;
  }
}
