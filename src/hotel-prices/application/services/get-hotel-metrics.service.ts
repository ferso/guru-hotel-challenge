import moment from "moment";
import { Service } from "typedi";
import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { GetCompetitorsPricesPort } from "src/hotel-prices/domain/ports/get-competitors-prices.port";
import { GetHotelPort } from "src/hotel-prices/domain/ports/get-hotel.port";
import { RemoteDataDTO } from "src/hotel-prices/dtos/fetch-remote.dto";
import { RoomType } from "src/shared/domain/enums/room-type";
import { GetHotelAdapter } from "src/hotel-prices/infra/remote-api/get-hotel.adapter";
import { GetCompetitorsPricesAdapter } from "src/hotel-prices/infra/remote-api/get-competitors-prices.adapter";

import { BaseGetRemoteService } from "./base-get-remote.service";
import { ResponseGetHotelMetricsDTO } from "../dtos/response-get-hotel-metrics.dto";

export interface InputProps {
  hotel_id: number;
  day: Date;
  room_type: RoomType;
}

@Service()
export class GetHotelMetricsService extends BaseGetRemoteService {
  hotel: Hotel;
  rooms: Room[] = [];
  competitors: CompetitorPrice[] = [];
  startDate: Date;
  roomType: RoomType;
  results: ResponseGetHotelMetricsDTO[] = [];

  setDate(day: Date) {
    this.startDate = moment(day).utcOffset(0).toDate();
  }
  getDateForFetch(date: Date) {
    return moment(date).utcOffset(0).format("DD/MM/YYYY");
  }
  setRoomType(roomType: RoomType) {
    this.roomType = roomType;
  }

  async execute(hotel_id: number, day: Date, room_type: RoomType) {
    this.setDate(day);
    this.setRoomType(room_type);
    const args = { hotel_id, day, room_type };
    await this.isNeededFetching(args);

    if (!this.cache) {
      let fecthData: RemoteDataDTO = await this.fetch(
        hotel_id,
        new GetHotelAdapter(),
        new GetCompetitorsPricesAdapter()
      );
      await this.saveFetch(fecthData.hotel, fecthData.competitors);
      await this.resolveResult();
      this.cache = await this.saveCache();
    }
    return this.cache?.data;
  }

  async isNeededFetching(args: InputProps): Promise<any> {
    return await super.isNeededFetching(args);
  }

  async fetch(
    hotel_id: number,
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
      net_amount: competitor.getNetAmount(),
    };
  }

  async getBestPrice(room: Room) {
    let bestPrice = await this.competitorsPricesRepository.findBestPrice(
      room.remote_id,
      this.roomType.toString(),
      this.startDate
    );
    if (bestPrice) {
      return this.mapperMetrics(bestPrice);
    }
    return null;
  }

  async getWorstPrice(room: Room) {
    let worstPrice = await this.competitorsPricesRepository.findWorstPrice(
      room.remote_id,
      this.roomType.toString(),
      this.startDate
    );
    if (worstPrice) {
      return this.mapperMetrics(worstPrice);
    }
    return null;
  }
  async getAvergePrice(room) {
    let averagePrice = await this.competitorsPricesRepository.findAveragePrice(
      room.remote_id,
      this.roomType.toString(),
      this.startDate
    );
    if (averagePrice) {
      return this.mapperMetrics(averagePrice);
    }

    return null;
  }
  async resolveResult(): Promise<ResponseGetHotelMetricsDTO[]> {
    let rooms = await this.roomRepository.getAllByHotel(this.hotel);

    for (let x in rooms) {
      let room: Room = rooms[x];
      if (room.type === this.roomType) {
        let metrics: any = {};
        metrics.best_price = await this.getBestPrice(room);
        metrics.worst_price = await this.getWorstPrice(room);
        metrics.average_price = await this.getAvergePrice(room);

        this.results.push({
          room_id: room.remote_id,
          room_name: room.name,
          last_updated_at: room.updated_at,
          metrics,
        });
      }
    }
    return this.results;
  }
}
