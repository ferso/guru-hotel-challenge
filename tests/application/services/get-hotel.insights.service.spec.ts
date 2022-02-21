import { GetHotelInsightsService } from "src/hotel-prices/application/services/get-hotel-insights.service";
import { GetHotelMetricsService } from "src/hotel-prices/application/services/get-hotel-metrics.service";
import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { Currencies } from "src/shared/domain/enums/currencies";
import { Currency } from "src/shared/domain/value-object/currency.value";
import { Price } from "src/shared/domain/value-object/price.model";
import { mongoServerDbMocks } from "tests/database/container";
import { Connection, createConnection } from "typeorm";

const dotenv = require("dotenv");
dotenv.config();

describe("GetHotelInsightsService specs", () => {
  let client: Connection;

  let getHotelMetricsService: GetHotelMetricsService;
  beforeAll(async () => {
    client = await mongoServerDbMocks();
    getHotelMetricsService = new GetHotelMetricsService();
  });
  afterAll(() => {
    client.dropDatabase();
    client.close();
  });

  it("validate cacheData before fetch remote", async () => {
    let result = await getHotelMetricsService.cacheData(1);
    expect(result).toBe(false);
  });

  it("validate cacheData Before fetech remote", async () => {});
});
