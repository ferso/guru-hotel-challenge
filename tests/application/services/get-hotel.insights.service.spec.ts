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

describe("GetHotelInsightsService specs", () => {
  config();
  let client: Connection;
  let getHotelInsightsService: GetHotelInsightsService;
  beforeAll(async () => {
    expect.extend(
      matchersWithOptions({
        verbose: true,
      })
    );

    client = await mongoServerDbMocks();
    getHotelInsightsService = new GetHotelInsightsService();
  });
  afterAll(async () => {
    if (client) {
      await client.dropDatabase().catch((error) => error);
      await client.close().catch((error) => error);
    }
  });

  it("validate fetch remote ", async () => {
    let result = await getHotelInsightsService.isNeededFetching({
      hotel_id: 1,
      period: 30,
      limit: 1,
    });

    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  });

  it("validate schema result from Insights response service", async () => {
    const schema = {
      $id: "testSchema",
      type: "object",
      properties: {
        room_id: {
          type: "object",
        },
        room_name: {
          type: "string",
        },
        last_updated_at: {
          type: "object",
          format: "date",
        },
        prices: {
          type: ["array"],
          properties: {
            id: {
              type: "string",
            },
            competitor_name: {
              type: "string",
            },
            currency: {
              type: "string",
            },
            taxes: {
              type: "number",
            },
            amount: {
              type: "number",
            },
            date: {
              type: "string",
              format: "date",
            },
            room_id: {
              type: "string",
            },
          },
        },
      },
      required: ["room_id", "room_name", "last_updated_at"],
    };

    let result = await getHotelInsightsService.execute(1, PeriodType.P60, 110);
    expect(typeof result).toBe("object");
    expect(result[1]).toMatchSchema(schema);
  });
});
