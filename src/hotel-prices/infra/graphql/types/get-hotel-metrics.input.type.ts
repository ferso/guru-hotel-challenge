import { PeriodType } from "src/shared/domain/enums/period-type";
import { RoomType } from "src/shared/domain/enums/room-type";
import {
  ArgsType,
  Field,
  InputType,
  registerEnumType,
  Int,
} from "type-graphql";

registerEnumType(RoomType, {
  name: "RoomType",
  description: "business, residential ",
});

@ArgsType()
@InputType("GetHotelMetricsInputType")
export class GetHotelMetricsInputType {
  @Field((type) => Int)
  hotel_id: number;

  @Field((type) => Date, { description: "format YYYY-MM-DD" })
  day: Date;

  @Field((type) => RoomType)
  room_type: string;
}
