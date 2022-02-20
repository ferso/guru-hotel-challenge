import { Hotel } from "../model/hotel.model";
export interface IHotelRepository {
  save(hotel: Hotel): Promise<Hotel>;
  update(hotel: Hotel): Promise<Hotel>;
  getById(hotel: Hotel): Promise<Hotel>;
  getAll(hotel: Hotel): Promise<Hotel[]>;
}
