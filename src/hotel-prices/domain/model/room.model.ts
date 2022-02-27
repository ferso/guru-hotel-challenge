import { CompetitorPrice } from "./competitor-price.model";
import { Hotel } from "./hotel.model";
import { AggregateRoot } from "src/shared/domain/model/aggregate-root";
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
  created_at?: Date;
  competitorsPrice?: CompetitorPrice[];
}

export class Room extends AggregateRoot {
  id?: string;
  remote_id?: string;
  name?: string;
  type?: string;
  bed_count?: number;
  amenities?: string[];
  hotel?: Hotel;
  hotel_id?: string;
  competitorsPrice?: CompetitorPrice[] = [];
  updated_at?: Date;
  created_at?: Date;
  constructor(props?: RoomProps) {
    super();
    this.setRemoteId(props?.remote_id);
    this.setId(props?.id);
    this.setName(props?.name);
    this.setType(props?.type);
    this.setBedCount(props?.bed_count);
    this.setHotel(props?.hotel);
    this.setUpdatedAt(props?.updated_at);
    this.setCreatedAt(props?.created_at);
    this.setAmenities(props?.amenities);
  }

  setId(id: string) {
    this.id = id;
  }

  setRemoteId(id: string) {
    if (id !== null) {
      this.remote_id = id;
    }
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

  setAmenities(amenities: string[]) {
    this.amenities = amenities;
  }

  setHotelId(hotel_id: string) {
    this.hotel_id = hotel_id;
  }
  setUpdatedAt(date: Date) {
    this.updated_at = date || new Date();
  }
  setCreatedAt(date: Date) {
    this.created_at = date || new Date();
  }
  addCompetitor(competitorsPrice: CompetitorPrice) {
    this.competitorsPrice.push(competitorsPrice);
  }

  addCompetitorEvent() {}
}
