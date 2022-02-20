import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "CompetitorMetrics" })
export class CompetitorMetrics {
  @Field((type) => String, { nullable: true })
  competitor_name: string;

  @Field((type) => Int, { nullable: true })
  gross_amount: number;

  @Field((type) => Int, { nullable: true })
  net_amount: number;
}
