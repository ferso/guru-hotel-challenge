import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { HotelEntity } from "../entities/hotel.entity";

export class HotelMapper {
  hotel: HotelEntity;
  constructor(hotel: HotelEntity) {
    this.hotel = hotel;
  }
  execute(): Hotel {
    if (this.hotel) {
      const hotel = new Hotel({
        name: this.hotel?.name,
        city: this.hotel?.city,
        state: this.hotel?.state,
        remote_id: this.hotel.remote_id,
        updated_at: this.hotel.updated_at,
        created_at: this.hotel.created_at,
      });
      for (let x in this.hotel.rooms) {
        let room = new Room({
          id: this.hotel.rooms[x].id,
          remote_id: this.hotel.rooms[x].id,
          name: this.hotel.rooms[x].name,
          type: this.hotel.rooms[x].type,
          bed_count: this.hotel.rooms[x].bed_count,
          amenities: this.hotel.rooms[x].amenities,
        });
        hotel.setRoom(room);
      }
      return hotel;
    }
    return null;
  }
}
