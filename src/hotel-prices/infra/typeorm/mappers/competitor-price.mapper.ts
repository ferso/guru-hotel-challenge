import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { Currencies } from "src/shared/domain/enums/currencies";
import { Currency } from "src/shared/domain/value-object/currency.value";
import { Price } from "src/shared/domain/value-object/price.model";
import { CompetitorPriceEntity } from "../entities/competitors-prices.entity";
import { HotelEntity } from "../entities/hotel.entity";

export class CompetitorPriceMapper {
  execute(competitor?: CompetitorPriceEntity): CompetitorPrice {
    if (competitor) {
      return new CompetitorPrice({
        id: competitor?.id,
        room: competitor.room,
        date: competitor.date,
        name: competitor.name,
        price: new Price({
          currency: Currency.of(competitor.price.amount, Currencies.USD),
          amount: competitor.price.amount,
          tax: competitor.price.tax,
        }),
      });
    }
  }
  toEntity(competitor: CompetitorPrice) {
    return {
      name: competitor.name,
      date: competitor.date,
      room: {
        remote_id: competitor.room.remote_id,
      },
      price: {
        amount: competitor.price.amount,
        tax: competitor.price.tax,
        currency: {
          name: competitor.price.currency.name,
        },
      },
    };
  }

  fromAggregate(data: any): CompetitorPrice {
    if (data) {
      return new CompetitorPrice({
        id: data?.id?.toString(),
        room: new Room(data.room),
        date: data.date,
        name: data.name,
        price: new Price({
          currency: Currency.of(data.price.amount, data.price.currency.name),
          amount: data.price.amount,
          tax: data.price.tax,
        }),
      });
    }
    return null;
  }
}
