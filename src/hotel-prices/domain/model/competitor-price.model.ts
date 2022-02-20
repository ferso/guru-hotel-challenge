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
}
export class CompetitorPrice {
  id?: string;
  name: string;
  price: Price;
  date: Date;
  updated_at?: Date;
  room?: Room;
  hotel?: Hotel;
  constructor(props?: CompetitorPriceProps) {
    this.setId(props.id);
    this.setName(props.name);
    this.setPrice(props.price);
    this.setDate(props.date);
    this.setRoom(props.room);
    this.setHotel(props.hotel);
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
}
