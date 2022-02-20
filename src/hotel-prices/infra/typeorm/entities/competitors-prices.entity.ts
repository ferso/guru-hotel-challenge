import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
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

  @Column()
  @Index("date_idx")
  date: Date;

  @Column({ name: "name" })
  name: string;

  @Column()
  price: Price;

  @Column()
  room?: Room;

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
