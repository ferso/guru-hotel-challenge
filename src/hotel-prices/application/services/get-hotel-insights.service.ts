import moment from "moment";
import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { GetCompetitorsPricesPort } from "src/hotel-prices/domain/ports/get-competitors-prices.port";
import { GetHotelPort } from "src/hotel-prices/domain/ports/get-hotel.port";
import { RemoteDataDTO } from "src/hotel-prices/dtos/fetch-remote.dto";
import { CompetitorsPricesRepository } from "src/hotel-prices/infra/typeorm/repositories/competitors-prices.respository";
import { HotelRepository } from "src/hotel-prices/infra/typeorm/repositories/hotel.respository";
import { PeriodType } from "src/shared/domain/enums/period-type";

export class GetHotelInsightsService {
  hotelRepository: HotelRepository;
  competitorsPricesRepository: CompetitorsPricesRepository;
  constructor() {
    this.hotelRepository = new HotelRepository();
    this.competitorsPricesRepository = new CompetitorsPricesRepository();
  }

  async cacheData(id: number): Promise<RemoteDataDTO | unknown> {
    let check = await this.hotelRepository.getCheckUpdate(id);
    if (!check) {
      let hotel = await this.hotelRepository.getByIdentifier(id);
      return this.resolveResult(hotel);
    }
    return false;
  }
  async fetch(
    hotel_id: number,
    period: PeriodType,
    getHotelAdapter: GetHotelPort,
    getCompetitorsPricesAdapter: GetCompetitorsPricesPort
  ): Promise<RemoteDataDTO> {
    let date = moment().utcOffset(0);
    let startDate = date.format("DD/MM/YYYY");
    let endDate = date.add(5, "day").format("DD/MM/YYYY");

    //fetch hotel
    let hotel = await getHotelAdapter.execute(hotel_id);
    //fetch rooms prices from remote
    let competitors = await getCompetitorsPricesAdapter.execute(
      hotel_id,
      startDate,
      endDate
    );
    return {
      hotel,
      competitors,
    };
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
