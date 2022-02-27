import { Price } from "src/shared/domain/value-object/price.model";
import { CompetitorPrice } from "./competitor-price.model";
import { Room } from "./room.model";

export interface HotelProps {
  id?: string;
  name?: string;
  city?: string;
  state?: string;
  rooms?: Room[];
  remote_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
export class Hotel {
  id?: string;
  name: string;
  city?: string;
  state?: string;
  rooms?: Room[] = [];
  remote_id?: number;
  remote_hotel_id: number;
  created_at?: Date;
  updated_at?: Date;

  constructor(props?: HotelProps) {
    this.setId(props?.id);
    this.setName(props?.name);
    this.setCity(props?.city);
    this.setState(props?.state);
    this.setRemoteId(props?.remote_id);
    this.setCreatedAt(props?.created_at);
    this.setUpdatedAt(props?.updated_at);
  }
  setId(id: string) {
    this.id = id;
  }
  setRemoteId(id: number) {
    if (id !== null) {
      this.remote_id = id;
    }
  }
  setName(name: string) {
    this.name = name;
  }
  setCity(city: string) {
    this.city = city;
  }
  setState(state: string) {
    this.state = state;
  }
  setRoom(room: Room) {
    this.rooms.push(room);
  }

  setAllRooms(rooms: Room[]) {
    this.rooms = rooms;
  }
  setUpdatedAt(date: Date) {
    this.updated_at = date;
  }
  setCreatedAt(date: Date) {
    this.created_at = date;
  }
  serialize() {
    return {
      id: this.id,
      remote_id: this.remote_id,
      name: this.name,
      city: this.city,
      state: this.state,
    };
  }
}
