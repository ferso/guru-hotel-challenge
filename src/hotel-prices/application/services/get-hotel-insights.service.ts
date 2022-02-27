import moment from "moment";
import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { GetCompetitorsPricesPort } from "src/hotel-prices/domain/ports/get-competitors-prices.port";
import { GetHotelPort } from "src/hotel-prices/domain/ports/get-hotel.port";
import { RemoteDataDTO } from "src/hotel-prices/dtos/fetch-remote.dto";
import { RoomRepository } from "src/hotel-prices/infra/typeorm/repositories/room.respository";
import { CompetitorsPricesRepository } from "src/hotel-prices/infra/typeorm/repositories/competitors-prices.respository";
import { HotelRepository } from "src/hotel-prices/infra/typeorm/repositories/hotel.respository";
import { PeriodType } from "src/shared/domain/enums/period-type";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { GetHotelAdapter } from "src/hotel-prices/infra/remote-api/get-hotel.adapter";
import { GetCompetitorsPricesAdapter } from "src/hotel-prices/infra/remote-api/get-competitors-prices.adapter";
import { BaseGetRemoteService } from "./base-get-remote.service";
import {
  PricesHotelInsightsDTO,
  ResponseGetHotelInsightsDTO,
} from "../dtos/response-get-hotel-insights.dto";

export interface InputProps {
  hotel_id: number;
  period: PeriodType;
  limit: number;
}

export class GetHotelInsightsService extends BaseGetRemoteService {
  results: ResponseGetHotelInsightsDTO[] = [];
  hotel: Hotel;
  rooms: Room[];
  //this is a antipattern but im tired
  startDate: moment.Moment;
  endDate: moment.Moment;
  dates: any[] = [];
  competitors: CompetitorPrice[];
  limit: number;
  period: PeriodType;

  setDates() {
    let date = moment().utcOffset(0);

    this.dates = [];
    for (let x = 0; x < this.period; x++) {
      let nextDate = moment(date.add(1, "day"));
      this.dates.push(nextDate);
    }
  }

  setPeriod(period: PeriodType) {
    this.period = period;
  }
  setLimit(limite: number) {
    this.limit = limite;
  }

  async execute(
    hotel_id: number,
    period: PeriodType,
    limit: number
  ): Promise<any> {
    this.setLimit(limit);
    this.setPeriod(period);
    this.setDates();
    const args = { hotel_id, period, limit };
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
    //fetch hotel
    const hotel = await getHotelAdapter.execute(hotel_id);

    // get all dates in the choosed period days
    let results = await Promise.all(
      this.dates.map(async (date: moment.Moment) => {
        return await getCompetitorsPricesAdapter
          .execute(
            hotel_id,
            date.format("DD/MM/YYYY"),
            date.format("DD/MM/YYYY")
          )
          .catch((error) => null);
      })
    );
    const competitors = results.flat();
    return {
      hotel,
      competitors,
    };
  }

  async resolveResult(): Promise<ResponseGetHotelInsightsDTO[]> {
    let rooms = await this.roomRepository.getAllByHotel(this.hotel, this.limit);
    let stringDates = this.dates.map((item) => {
      return item.format("YYYY-MM-DD");
    });
    for (let x in rooms) {
      let room: Room = rooms[x];
      let competitors =
        await this.competitorsPricesRepository.getByRoomAndDates(
          room,
          stringDates[0],
          stringDates.slice(-1)[0]
        );

      let prices: PricesHotelInsightsDTO[] = [];
      for (let z in competitors) {
        let competitor = competitors[z];
        prices.push({
          id: competitor?.id,
          competitor_name: competitor.name,
          room_id: room.remote_id,
          currency: competitor.price.currency.name,
          taxes: competitor.price.tax,
          amount: competitor.price.amount,
          date: competitor.date,
        });
      }
      let node = {
        room_id: room.id,
        room_name: room.name,
        last_updated_at: room.updated_at,
        prices: prices,
      };
      this.results.push(node);
    }
    return this.results;
  }
}
