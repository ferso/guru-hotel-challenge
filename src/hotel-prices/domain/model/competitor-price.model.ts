import { Price, PriceProps } from "src/shared/domain/value-object/price.model";
import { Hotel } from "./hotel.model";
import { Room } from "./room.model";
export interface CompetitorPriceProps {
  id?: string;
  name: string;
  price: Price;
  date: Date;
  room?: Room;
  hotel?: Hotel;
  updated_at?: Date;
  room_remote_id?: string;
  hotel_remote_id?: string;
}
export class CompetitorPrice {
  id?: string;
  name: string;
  price: Price;
  date: Date;
  updated_at?: Date;
  room_remote_id?: string;
  hotel_remote_id?: string;
  room?: Room;
  hotel?: Hotel;
  room_id?: string;
  constructor(props?: CompetitorPriceProps) {
    this.setId(props?.id);
    this.setName(props?.name);
    this.setPrice(props?.price);
    this.setDate(props?.date);
    this.setRoom(props?.room);
    this.setHotel(props?.hotel);
    this.setRoomRemoteId(props.room_remote_id);
    this.setHotelRemoteId(props.hotel_remote_id);
  }
  setHotelRemoteId(id: string) {
    this.hotel_remote_id = id;
  }
  setRoomRemoteId(id: string) {
    this.room_remote_id = id;
  }

  setId(id: string) {
    this.id = id;
  }
  setName(name: string) {
    this.name = name;
  }

  setPrice(price: Price) {
    this.price = price;
  }
  setDate(date: Date) {
    this.date = date;
  }

  setRoom(room: Room) {
    this.room = room;
  }
  setHotel(hotel: Hotel) {
    this.hotel = hotel;
  }

  setRoomId(id: string) {
    this.room_id = id;
  }

  getNetAmount() {
    return this?.price?.amount - this?.price?.tax || 0;
  }
}
