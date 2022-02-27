import { CompetitorPrice } from "../domain/model/competitor-price.model";
import { Hotel } from "../domain/model/hotel.model";

export interface RemoteDataDTO {
  hotel: Hotel;
  competitors: CompetitorPrice[];
}
