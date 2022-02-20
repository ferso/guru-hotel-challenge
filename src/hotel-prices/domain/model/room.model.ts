import { CompetitorPrice } from "./competitor-price.model";
import { Hotel, HotelProps } from "./hotel.model";

export interface RoomProps {
  id?: string;
  remote_id?: string;
  name?: string;
  type?: string;
  bed_count?: number;
  amenities?: string[];
  hotel?: Hotel;
  hotel_id?: string;
  updated_at?: Date;
}

export class Room {
  id?: string;
  remote_id?: string;
  name?: string;
  type?: string;
  bed_count?: number;
  amenities?: string[];
  hotel?: Hotel;
  hotel_id?: string;
  competitorsPrice?: CompetitorPrice[];
  updated_at?: Date;
  constructor(props?: RoomProps) {
    this.setRemoteId(props.remote_id);
    this.setId(props.id || props.remote_id);
    this.setName(props.name);
    this.setType(props.type);
    this.setBedCount(props.bed_count);
    this.setHotel(props.hotel);
    this.setUpdatedAt(props.updated_at);
  }

  setId(id: string) {
    this.id = id;
  }

  setRemoteId(id: string) {
    this.remote_id = id;
  }
  setName(name: string) {
    this.name = name;
  }

  setType(type: string) {
    this.type = type;
  }

  setBedCount(count: number) {
    this.bed_count = count;
  }

  setHotel(hotel: Hotel) {
    this.hotel = hotel;
  }

  setHoteId(hotel_id: string) {
    this.hotel_id = hotel_id;
  }
  setUpdatedAt(date: Date) {
    this.updated_at = date || new Date();
  }
}
