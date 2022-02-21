import { Hotel } from "../model/hotel.model";

export interface GetHotelPort {
  execute(id: number): Promise<Hotel>;
  mapper(payload: any, id: number): Hotel;
}
