import { PeriodType } from "src/shared/domain/enums/period-type";
import { RoomType } from "src/shared/domain/enums/room-type";
import {
  ArgsType,
  Field,
  InputType,
  registerEnumType,
  Int,
  ObjectType,
  Directive,
  UseMiddleware,
} from "type-graphql";
import { HotelMetrics } from "./hotel-metrics.type";

registerEnumType(PeriodType, {
  name: "PeriodType",
  description: "Period 30,60, 90 days",
});

registerEnumType(RoomType, {
  name: "RoomType",
  description: "business, residential ",
});

@ObjectType({ description: "GetHotelMetricsResponseType" })
export class GetHotelMetricsResponseType {
  @Field((type) => String)
  room_id: string;

  @Field((type) => String)
  room_name: number;

  @Field((type) => HotelMetrics, { nullable: true })
  metrics: HotelMetrics;

  @Field()
  date: Date;
}
