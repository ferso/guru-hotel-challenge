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

@ObjectType({ description: "PriceType" })
export class PriceType {
  @Field((type) => String)
  competitor_name: string;

  @Field((type) => String)
  id: string;

  @Field((type) => String)
  room_id: string;

  @Field((type) => String)
  currency: string;

  @Field((type) => String)
  taxes: string;

  @Field((type) => Int)
  amount: number;

  @Field()
  date: Date;

  @Field()
  last_update: Date;
}
