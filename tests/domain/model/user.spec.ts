import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { CreateUserHandler } from "src/shared/infra/handlers/create-user-handler";
import { User } from "src/shared/domain/model/user.model";
import Events from "src/shared/domain/events/events";
import { UserRepository } from "src/shared/infra/typeorm/repository/user.repository";
import { UserRepositoryMock } from "tests/repositories/user.repository.mock";
import { RolesType } from "src/shared/domain/enums/roles-type";
import { config } from "tests/config";

describe.skip("User  specs", () => {
  config();
  beforeAll(() => {
    // Events.suscribe(
    //   "CreateUserEvent",
    //   new CreateUserHandler(new UserRepositoryMock())
    // );
  });

  it("validate props in Room model", () => {
    let props = {
      id: "12312312312",
      name: "Fernand Soto",
      email: "erickfernando@gmail.com",
      role: RolesType.admin,
    };

    const user = new User(props);
    user.create();

    expect(user.name).toEqual(props.name);
    // expect(room.id).toEqual(props.id);
    // expect(room.competitorsPrice).toHaveLength(3);
    // expect(room.competitorsPrice[0]).toBeInstanceOf(CompetitorPrice);
  });
});
