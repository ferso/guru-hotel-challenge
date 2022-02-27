import { PeriodType } from "src/shared/domain/enums/period-type";
import { RoomType } from "src/shared/domain/enums/room-type";
import {
  ArgsType,
  Field,
  InputType,
  registerEnumType,
  Int,
  ObjectType,
} from "type-graphql";
import { PriceType } from "./prices.type";

registerEnumType(PeriodType, {
  name: "PeriodType",
  description: "Period 30,60, 90 days",
});

registerEnumType(RoomType, {
  name: "RoomType",
  description: "business, residential ",
});

@ObjectType({ description: "GetHotelInsightsResponseType" })
export class GetHotelInsightsResponseType {
  @Field((type) => String)
  room_id: string;

  @Field((type) => String)
  room_name: number;

  @Field((type) => [PriceType])
  prices: PriceType[];

  @Field()
  last_updated_at: Date;
}
