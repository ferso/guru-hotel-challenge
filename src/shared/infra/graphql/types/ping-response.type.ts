import { PeriodType } from "src/shared/domain/enums/period-type";
import { RoomType } from "src/shared/domain/enums/room-type";
import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "PingResponseType" })
export class PingResponseType {
  @Field()
  db: boolean;

  @Field()
  local_api: boolean;

  @Field()
  external_api: boolean;
}
