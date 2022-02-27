import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { Currencies } from "src/shared/domain/enums/currencies";
import { Currency } from "src/shared/domain/value-object/currency.value";
import { Price } from "src/shared/domain/value-object/price.model";
import { CompetitorPriceEntity } from "../entities/competitors-prices.entity";

export class CompetitorPriceMapper {
  execute(competitor?: CompetitorPriceEntity): CompetitorPrice {
    if (competitor) {
      return new CompetitorPrice({
        id: competitor.id,
        date: competitor.date,
        name: competitor.name,
        price: new Price({
          currency: Currency.of(competitor.price.amount, Currencies.USD),
          amount: competitor.price.amount,
          tax: competitor.price.tax,
        }),
        room_remote_id: competitor.room_remote_id,
        hotel_remote_id: competitor.hotel_remote_id,
      });
    }
  }
  toEntity(competitor: CompetitorPrice) {
    return {
      name: competitor.name,
      date: competitor.date,
      room_remote_id: competitor.room.remote_id,
      hotel_id: competitor.hotel.remote_id,
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
