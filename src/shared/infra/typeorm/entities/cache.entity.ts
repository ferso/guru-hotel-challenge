import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity("cache")
export class CacheEntity extends BaseEntity {
  @ObjectIdColumn()
  id?: number;

  @Column({ nullable: true })
  @Index("key_idx")
  key: string;

  @Column({ nullable: true })
  data: object;

  @CreateDateColumn({
    name: "created_at",
    nullable: false,
    default: () => new Date(),
  })
  @Index("created_at_idx", { expireAfterSeconds: 10 })
  created_at: Date;

  @UpdateDateColumn({
    name: "updated_at",
    nullable: false,
    default: () => new Date(),
  })
  updated_at: Date;
}
