import { Connection } from "typeorm";
import { matchers, matchersWithOptions } from "jest-json-schema";

import { GetHotelInsightsService } from "src/hotel-prices/application/services/get-hotel-insights.service";
import { GetHotelMetricsService } from "src/hotel-prices/application/services/get-hotel-metrics.service";
import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { GetCompetitorsPricesAdapter } from "src/hotel-prices/infra/remote-api/get-competitors-prices.adapter";
import { Currencies } from "src/shared/domain/enums/currencies";
import { Currency } from "src/shared/domain/value-object/currency.value";
import { Price } from "src/shared/domain/value-object/price.model";
import { mongoServerDbMocks } from "tests/database/container";
import { config } from "tests/config";
import { PeriodType } from "src/shared/domain/enums/period-type";
import { RoomType } from "src/shared/domain/enums/room-type";

describe("GetHotelMetricsService specs", () => {
  config();
  let client: Connection;
  let getHotelMetricsService: GetHotelMetricsService;
  beforeAll(async () => {
    expect.extend(
      matchersWithOptions({
        verbose: true,
      })
    );
    client = await mongoServerDbMocks();
    getHotelMetricsService = new GetHotelMetricsService();
  });
  afterAll(async () => {
    if (client) {
      await client.dropDatabase().catch((error) => error);
      await client.close().catch((error) => error);
    }
  });

  it("validate fetch remote", async () => {
    let result = await getHotelMetricsService.isNeededFetching({
      hotel_id: 1,
      day: new Date("2022-03-04"),
      room_type: RoomType.business,
    });

    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  });

  it("validate schema result from Metrics response service", async () => {
    const segmentPropierties = {
      gross_amount: {
        type: "number",
      },
      net_amount: {
        type: "number",
      },
      competitor_name: {
        type: "string",
      },
    };
    const schema = {
      $id: "testSchema",
      type: "object",
      properties: {
        room_id: {
          type: "string",
        },
        room_name: {
          type: "string",
        },
        metrics: {
          type: "object",
          properties: {
            best_price: {
              type: "object",
              properties: segmentPropierties,
            },
            average_price: {
              type: "object",
              properties: segmentPropierties,
            },
            worst_price: {
              type: "object",
              properties: segmentPropierties,
            },
          },
        },
      },
      required: ["room_id", "room_name"],
    };

    let result = await getHotelMetricsService.execute(
      5,
      new Date("2022-03-04"),
      RoomType.business
    );
    expect(typeof result).toBe("object");
    expect(result[1]).toMatchSchema(schema);
  });
});
