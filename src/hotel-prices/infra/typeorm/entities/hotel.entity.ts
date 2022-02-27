import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import {
  Entity,
  Index,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("hotels")
export class HotelEntity {
  @ObjectIdColumn()
  id: string;

  @Column()
  @Index("remote_id_idx")
  remote_id: number;

  @Column()
  @Index("name_idx", { fulltext: true })
  name: string;

  @Column()
  @Index("city_idx", { fulltext: true })
  city: string;

  @Column()
  @Index("state_idx", { fulltext: true })
  state: string;

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
  // @Index("created_at_idx", { expireAfterSeconds: 10 })
}
