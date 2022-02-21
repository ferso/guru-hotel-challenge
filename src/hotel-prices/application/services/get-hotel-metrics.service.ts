import moment from "moment";
import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { GetCompetitorsPricesPort } from "src/hotel-prices/domain/ports/get-competitors-prices.port";
import { GetHotelPort } from "src/hotel-prices/domain/ports/get-hotel.port";
import { RemoteDataDTO } from "src/hotel-prices/dtos/fetch-remote.dto";
import { CompetitorsPricesRepository } from "src/hotel-prices/infra/typeorm/repositories/competitors-prices.respository";
import { HotelRepository } from "src/hotel-prices/infra/typeorm/repositories/hotel.respository";
import { PeriodType } from "src/shared/domain/enums/period-type";
import { RoomType } from "src/shared/domain/enums/room-type";

export class GetHotelMetricsService {
  startDate: Date;
  roomType: RoomType;
  hotelRepository: HotelRepository;
  competitorsPricesRepository: CompetitorsPricesRepository;
  constructor() {
    this.hotelRepository = new HotelRepository();
    this.competitorsPricesRepository = new CompetitorsPricesRepository();
  }

  async cacheData(id: number, day: Date, room_type: RoomType) {
    this.setDate(day);
    this.setRooType(room_type);
    let check = await this.hotelRepository.getCheckUpdate(id);
    if (!check) {
      let hotel = await this.hotelRepository.getByIdentifier(id);
      return this.resolveResult(hotel);
    }
    return false;
  }

  async execute(hotel: Hotel, competitors: CompetitorPrice[]) {
    let nHotel = await this.hotelRepository.save(hotel);
    await this.competitorsPricesRepository.saveEach(competitors);
    return this.resolveResult(nHotel);
  }

  setDate(day: Date) {
    this.startDate = moment(day).utcOffset(0).toDate();
  }

  getDateForFetch(date: Date) {
    return moment(date).utcOffset(0).format("DD/MM/YYYY");
  }

  setRooType(roomType: RoomType) {
    this.roomType = roomType;
  }

  async fetch(
    hotel_id: number,
    day: Date,
    getHotelAdapter: GetHotelPort,
    getCompetitorsPricesAdapter: GetCompetitorsPricesPort
  ): Promise<RemoteDataDTO> {
    // fetch hotel
    let hotel = await getHotelAdapter.execute(hotel_id);
    //fetch rooms prices from remote
    let competitors = await getCompetitorsPricesAdapter.execute(
      hotel_id,
      this.getDateForFetch(this.startDate),
      this.getDateForFetch(this.startDate)
    );

    return {
      hotel,
      competitors,
    };
  }

  mapperMetrics(competitor: CompetitorPrice) {
    return {
      competitor_name: competitor?.name,
      gross_amount: competitor?.price?.amount || 0,
      net_amount: competitor?.price?.amount - competitor?.price?.tax || 0,
    };
  }

  async resolveResult(hotel: Hotel) {
    let rooms = [];
    for (let x in hotel.rooms) {
      let room = hotel.rooms[x];
      if (room.type === this.roomType) {
        let metrics: any = {};

        let bestPrice = await this.competitorsPricesRepository.findBestPrice(
          room.remote_id,
          this.roomType.toString(),
          this.startDate
        );

        if (bestPrice) {
          metrics.best_price = this.mapperMetrics(bestPrice);
        }

        let worstPrice = await this.competitorsPricesRepository.findWorstPrice(
          room.remote_id,
          this.roomType.toString(),
          this.startDate
        );
        if (worstPrice) {
          metrics.worst_price = this.mapperMetrics(worstPrice);
        }

        let averagePrice =
          await this.competitorsPricesRepository.findAveragePrice(
            room.remote_id,
            this.roomType.toString(),
            this.startDate
          );

        if (averagePrice) {
          metrics.average_price = this.mapperMetrics(averagePrice);
        }

        rooms.push({
          room_id: room.id,
          room_name: room.name,
          last_updated_at: room.updated_at,
          metrics,
        });
      }
    }
    return rooms;
  }
}
