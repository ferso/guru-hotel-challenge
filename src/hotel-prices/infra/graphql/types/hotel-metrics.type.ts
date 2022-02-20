import { PeriodType } from "src/shared/domain/enums/period-type";
import { RoomType } from "src/shared/domain/enums/room-type";
import { Field, Int, ObjectType } from "type-graphql";
import { CompetitorMetrics } from "./competitor-metrics.type";
import { PriceType } from "./prices.type";

@ObjectType({ description: "HotelMetrics" })
export class HotelMetrics {
  @Field((type) => CompetitorMetrics, { nullable: true })
  best_price: CompetitorMetrics;

  @Field((type) => CompetitorMetrics, { nullable: true })
  average_price: CompetitorMetrics;

  @Field((type) => CompetitorMetrics, { nullable: true })
  worst_price: CompetitorMetrics;
}
