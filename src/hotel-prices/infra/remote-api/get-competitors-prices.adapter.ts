import axios, { AxiosStatic } from "axios";
import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { Currencies } from "src/shared/domain/enums/currencies";
import { Currency } from "src/shared/domain/value-object/currency.value";
import { Price } from "src/shared/domain/value-object/price.model";
import { UnAvailbleApiError } from "src/shared/exceptions/unavailable-api.exception";
import { Logger } from "src/shared/infra/logger/logger";
import moment from "moment";
import { Service } from "typedi";

@Service()
export class GetCompetitorsPricesAdapter {
  http: AxiosStatic;
  id: number;
  logger: Logger;
  constructor() {
    this.logger = new Logger();
    this.http = axios;
  }
  async execute(
    id: number,
    start: string,
    end: string
  ): Promise<CompetitorPrice[]> {
    try {
      const endpoint = `${process.env.API_URL}/hotels/${id}/prices?start_date=${start}&end_date=${end}`;
      this.logger.info(`fetching competitors from remote ${id}`);
      this.logger.info(`${endpoint}`);
      let result = await this.http.get(endpoint);
      return this.mapper(result?.data, id);
    } catch (error) {
      this.logger.error(error.toString());
      throw new UnAvailbleApiError("Remote api is error");
    }
  }
  formatDate(str: string): Date {
    let date = moment(str, "DD/MM/YYYY").utcOffset(0);
    date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return date.toDate();
  }
  mapper(payload: any, id: number): CompetitorPrice[] {
    let competitors: CompetitorPrice[] = [];
    for (let x in payload.prices) {
      let dateData = payload.prices[x][0];
      let room = new Room({
        remote_id: x,
        hotel: new Hotel({ remote_id: id, name: null }),
      });

      //we get each date data
      for (let y in dateData) {
        let dateInfo = dateData[y];
        //we get all competitors according data structure
        for (let name in dateInfo) {
          let node = dateInfo[name];
          if (name !== "date") {
            // console.log(dateInfo.date, name, node);
            const competitor = new CompetitorPrice({
              room: room,
              hotel: room.hotel,
              date: this.formatDate(dateInfo.date),
              name: String(name),
              price: new Price({
                currency: Currency.of(node.price, node.currency),
                amount: node.price,
                tax: node.tax,
              }),
            });
            competitors.push(competitor);
          }
        }
      }
    }
    return competitors;
  }
}
