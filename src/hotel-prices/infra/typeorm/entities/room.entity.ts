import { ObjectId } from "mongodb";

import {
  Entity,
  Index,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

@Entity("rooms")
export class RoomEntity extends BaseEntity {
  @ObjectIdColumn()
  id: string;

  @Column()
  @Index("remote_id_idx")
  remote_id: string;

  @Column((type) => ObjectId)
  hotel_id: string;

  @Column()
  @Index("remote_hotel_id_idx")
  remote_hotel_id: number;

  @Column()
  @Index("name_idx", { fulltext: true })
  name: string;

  @Column()
  @Index("type_idx")
  type?: string;

  @Column()
  @Index("bed_count_idx")
  bed_count?: number;

  @Column()
  @Index("amenities_idx")
  amenities?: string[];

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
