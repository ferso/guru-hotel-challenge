import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity("users")
export class UserEntity extends BaseEntity {
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

  @CreateDateColumn({
    name: "created_at",
    nullable: false,
    default: () => new Date(),
  })
  created_at: Date;
  @UpdateDateColumn({
    name: "updated_at",
    nullable: false,
    default: () => new Date(),
  })
  updated_at: Date;
}
