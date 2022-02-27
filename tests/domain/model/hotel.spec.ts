import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { config } from "tests/config";
describe.skip("Hotel Model specs", () => {
  config();
  it("validate props in Hotel model", () => {
    let props = {
      id: "12312312312",
      name: "hotel",
      state: "CDMX",
      remote_id: 1,
    };
    const hotel = new Hotel(props);
    hotel.setRoom(new Room({ id: "aaaaaaa", bed_count: 1 }));
    hotel.setRoom(new Room({ id: "bbbbbb", bed_count: 2 }));
    expect(hotel.remote_id).toEqual(1);
    expect(hotel.name).toEqual(props.name);
    expect(hotel.id).toEqual(props.id);
    expect(hotel.rooms[0]).toBeInstanceOf(Room);
    expect(hotel.rooms).toHaveLength(2);
  });
});
