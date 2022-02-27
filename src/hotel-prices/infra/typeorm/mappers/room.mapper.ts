import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { Currency } from "src/shared/domain/value-object/currency.value";
import { Price } from "src/shared/domain/value-object/price.model";
import { HotelEntity } from "../entities/hotel.entity";
import { RoomEntity } from "../entities/room.entity";

export class RoomMapper {
  room: RoomEntity;
  static fromEntity(room: RoomEntity): Room {
    if (room) {
      let nwRoom = new Room({
        id: room.id,
        remote_id: room.remote_id,
        name: room.name,
        type: room.type,
        bed_count: room.bed_count,
        amenities: room.amenities,
      });
      return nwRoom;
    }
    return null;
  }
  static fromAggregate(room: any): Room {
    if (room) {
      let nwRoom = new Room({
        id: room._id,
        remote_id: room.remote_id,
        name: room.name,
        type: room.type,
        bed_count: room.bed_count,
        amenities: room.amenities,
      });

      if (room.competitors) {
        for (let x in room.competitors) {
          let doc = room.competitors[x];
          let competitor = new CompetitorPrice({
            id: doc?._id,
            room: nwRoom,
            date: doc.date,
            name: doc.name,
            price: new Price({
              currency: Currency.of(doc.price.amount, doc.price.currency.name),
              amount: doc.price.amount,
              tax: doc.price.tax,
            }),
          });
          nwRoom.addCompetitor(competitor);
        }
      }
      return nwRoom;
    }
    return null;
  }
  static toEntity(room: Room): RoomEntity {
    let entity = new RoomEntity();
    entity.amenities = room?.amenities;
    entity.bed_count = room?.bed_count;
    entity.remote_id = room?.remote_id;
    entity.remote_hotel_id = room?.hotel?.remote_id;
    entity.name = room?.name;
    entity.type = room?.type;
    entity.created_at = room?.created_at;
    if (room?.id) {
      entity.id = room?.id;
    }

    return entity;
  }
}
