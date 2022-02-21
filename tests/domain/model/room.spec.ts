import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";

const dotenv = require("dotenv");
dotenv.config();

describe("Hotel Room specs", () => {
  it("validate props in Room model", () => {
    let props = {
      id: "12312312312",
      remote_id: "123123123",
      name: "roomname",
      type: "bussines",
    };
    const room = new Room(props);
    room.addCompetitor(new CompetitorPrice());
    room.addCompetitor(new CompetitorPrice());
    room.addCompetitor(new CompetitorPrice());
    expect(room.name).toEqual(props.name);
    expect(room.id).toEqual(props.id);
    expect(room.competitorsPrice).toHaveLength(3);
    expect(room.competitorsPrice[0]).toBeInstanceOf(CompetitorPrice);
  });
});
