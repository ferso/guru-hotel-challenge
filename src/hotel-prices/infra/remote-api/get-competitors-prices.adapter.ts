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

export class GetCompetitorsPricesAdapter {
  http: AxiosStatic;
  id: number;
  logger: Logger;
  constructor() {
    this.logger = new Logger();
    this.http = axios;
  }
  async execute(id: number, period: number): Promise<CompetitorPrice[]> {
    let date = moment().utcOffset(0);
    let startDate = date.format("DD/MM/YYYY");
    let endDate = date.add(5, "day").format("DD/MM/YYYY");
    try {
      let result = await this.http.get(
        `http://localhost:5000/hotels/${id}/prices?start_date=${startDate}&end_date=${endDate}`
      );
      return this.mapper(result?.data, id);
    } catch (error) {
      this.logger.error(error.toString());
      throw new UnAvailbleApiError("Remote api is error");
    }
  }
  formatDate(str) {
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
