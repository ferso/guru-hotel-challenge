import { ObjectId } from "mongodb";
import { Price } from "src/shared/domain/value-object/price.model";
import {
  Entity,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("competitors")
export class CompetitorPriceEntity {
  @ObjectIdColumn()
  id: string;

  @Column((type) => ObjectId)
  room_id: string;

  @Column()
  @Index("date_idx")
  date: Date;

  @Column({ name: "name" })
  name: string;

  @Column()
  room_remote_id: string;

  @Column()
  hotel_remote_id: string;

  @Column()
  price: Price;

  @CreateDateColumn({
    name: "created_at",
    nullable: false,
    default: () => new Date(),
  })
  @Index("created_at_idx")
  created_at: Date;

  @UpdateDateColumn({
    name: "updated_at",
    nullable: false,
    default: () => new Date(),
  })
  @Index("updated_at_idx")
  updated_at: Date;
}

// @Index("created_at_idx", { expireAfterSeconds: 10 })
