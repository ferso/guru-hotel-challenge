import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { CompetitorsPricesRepository } from "src/hotel-prices/infra/typeorm/repositories/competitors-prices.respository";
import { HotelRepository } from "src/hotel-prices/infra/typeorm/repositories/hotel.respository";

export class GetHotelMetricsService {
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

  async execute(hotel: Hotel) {
    return this.resolveResult(hotel);
  }

  async resolveResult(hotel: Hotel) {
    let rooms = [];

    for (let x in hotel.rooms) {
      let room = hotel.rooms[x];
      let prices = [];

      let bestPrice = await this.competitorsPricesRepository.findBestPrice(
        room.remote_id,
        new Date("2022-02-02T00:00:00.000Z")
      );

      let worstPrice = await this.competitorsPricesRepository.findWorstPrice(
        room.remote_id,
        new Date("2022-02-02T00:00:00.000Z")
      );

      let averagePrice =
        await this.competitorsPricesRepository.findAveragePrice(
          room.remote_id,
          new Date("2022-02-02T00:00:00.000Z")
        );

      rooms.push({
        room_id: room.id,
        room_name: room.name,
        last_updated_at: room.updated_at,
        metrics: {
          best_price: {
            competitor_name: bestPrice?.name,
            gross_amount: bestPrice?.price?.amount,
            net_amount: bestPrice?.price?.amount - bestPrice?.price?.tax,
          },
          average_price: {
            competitor_name: averagePrice?.name,
            gross_amount: averagePrice?.price?.amount,
            // net_amount: averagePrice?.price?.amount - averagePrice?.price?.tax,
          },
          worst_price: {
            competitor_name: worstPrice?.name,
            gross_amount: worstPrice?.price?.amount,
            net_amount: worstPrice?.price?.amount - worstPrice?.price?.tax,
          },
        },
      });
    }
    return rooms;
  }
}
