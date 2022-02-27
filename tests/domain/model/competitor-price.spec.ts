import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { Currencies } from "src/shared/domain/enums/currencies";
import { Currency } from "src/shared/domain/value-object/currency.value";
import { Price } from "src/shared/domain/value-object/price.model";

import { config } from "tests/config";

describe.skip("CompetitorPrice specs", () => {
  config();
  it("validate props in CompetitorPrice model", () => {
    let props = {
      id: "12312312312",
      name: "guruhotel",
      date: new Date(),
      price: new Price({
        amount: 233,
        tax: 10,
        currency: Currency.of(233, Currencies.USD),
      }),
      updated_at: new Date(),
    };
    const competitorPrice = new CompetitorPrice(props);
    competitorPrice.setRoom(new Room({ name: "room", remote_id: "12312333" }));
    expect(competitorPrice.id).toEqual(props.id);
    expect(competitorPrice.name).toEqual(props.name);
    expect(competitorPrice.price).toBeInstanceOf(Price);
    expect(competitorPrice.room).toBeInstanceOf(Room);
    expect(competitorPrice.price.currency).toBeInstanceOf(Currency);
  });
});
