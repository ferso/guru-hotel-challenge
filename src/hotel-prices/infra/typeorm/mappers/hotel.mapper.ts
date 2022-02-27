import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { HotelEntity } from "../entities/hotel.entity";

export class HotelMapper {
  hotel: HotelEntity;
  constructor(hotel: HotelEntity) {
    this.hotel = hotel;
  }
  execute(): Hotel {
    return this.fromEntity(this.hotel);
  }
  fromEntity(entity: HotelEntity) {
    if (entity) {
      const hotel = new Hotel({
        id: entity.id,
        name: entity?.name,
        city: entity?.city,
        state: entity?.state,
        remote_id: entity.remote_id,
        updated_at: entity.updated_at,
        created_at: entity.created_at,
      });
      return hotel;
    }
    return null;
  }
}
