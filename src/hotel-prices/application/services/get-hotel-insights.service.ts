import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { CompetitorsPricesRepository } from "src/hotel-prices/infra/typeorm/repositories/competitors-prices.respository";
import { HotelRepository } from "src/hotel-prices/infra/typeorm/repositories/hotel.respository";

export class GetHotelInsightsService {
  hotelRepository: HotelRepository;
  competitorsPricesRepository: CompetitorsPricesRepository;
  constructor() {
    this.hotelRepository = new HotelRepository();
    this.competitorsPricesRepository = new CompetitorsPricesRepository();
  }

  async cacheData(id: number) {
    let check = await this.hotelRepository.getCheckUpdate(id);
    if (!check) {
      let hotel = await this.hotelRepository.getByIdentifier(id);
      return this.resolveResult(hotel);
    }
    return false;
  }
  async execute(hotel: Hotel, competitors: CompetitorPrice[]): Promise<any> {
    let nHotel = await this.hotelRepository.save(hotel);
    await this.competitorsPricesRepository.saveEach(competitors);

    return this.resolveResult(nHotel);
  }
  async resolveResult(hotel: Hotel) {
    let rooms = [];

    for (let x in hotel.rooms) {
      let room = hotel.rooms[x];
      let prices = [];
      let competitors = await this.competitorsPricesRepository.findRoomDates(
        room.id
      );

      for (let z in competitors) {
        let competitor = competitors[z];
        prices.push({
          id: competitor.id,
          competitor_name: competitor.name,
          currency: competitor.price.currency.name,
          taxes: competitor.price.tax,
          amount: competitor.price.amount,
          date: competitor.date,
          room_id: competitor.room.remote_id,
        });
      }

      rooms.push({
        room_id: room.id,
        room_name: room.name,
        last_updated_at: room.updated_at,
        prices: prices,
      });
    }
    return rooms;
  }
}

// "mongodb": "^3.6.0",
