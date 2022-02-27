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
