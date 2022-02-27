import { PeriodType } from "src/shared/domain/enums/period-type";
import { RoomType } from "src/shared/domain/enums/room-type";
import {
  ArgsType,
  Field,
  InputType,
  registerEnumType,
  Int,
} from "type-graphql";

registerEnumType(PeriodType, {
  name: "PeriodType",
  description: "Period 30,60, 90 days",
});

registerEnumType(RoomType, {
  name: "RoomType",
  description: "business, residential ",
});

@ArgsType()
@InputType("GetHotelInsightsInputType")
export class GetHotelInsightsInputType {
  @Field((type) => Int, { name: "hotel_id" })
  hotel_id: number;
  @Field((type) => PeriodType)
  period: number;
  @Field((type) => Int)
  limit: number;
}
