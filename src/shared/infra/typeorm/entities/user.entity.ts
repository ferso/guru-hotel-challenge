import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ObjectIdColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity("users")
export class UserEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id?: number;

  @Field()
  @Column({ nullable: true })
  name: string;

  @Field()
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  role: string;
}
