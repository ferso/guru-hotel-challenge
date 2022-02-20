import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { getConnection, getRepository, Repository } from "typeorm";
import { CompetitorPriceEntity } from "../entities/competitors-prices.entity";
import { CompetitorPriceMapper } from "../mappers/competitor-price.mapper";

export class CompetitorsPricesRepository {
  repository: Repository<CompetitorPriceEntity>;
  constructor() {
    this.repository = getRepository(CompetitorPriceEntity);
  }
  async saveEach(
    competitorsPrice: CompetitorPrice[]
  ): Promise<CompetitorPrice[]> {
    let response = [];
    for (let x in competitorsPrice) {
      let competitor = competitorsPrice[x];

      let resultCompetitor = await this.save(competitor);
      response.push(resultCompetitor);
    }
    return response;
  }

  async save(competitor: CompetitorPrice): Promise<CompetitorPrice> {
    let found = await this.findByValues(competitor);
    if (!found) {
      const mapper = new CompetitorPriceMapper();
      let result = await this.repository.save(mapper.toEntity(competitor));
      return mapper.execute(result);
    }

    return found;
  }

  async findByValues(competitor: CompetitorPrice): Promise<CompetitorPrice> {
    const result = await this.repository.findOne({
      where: {
        "room.remote_id": competitor.room.remote_id,
        date: competitor.date,
        name: competitor.name,
      },
    });
    const mapper = new CompetitorPriceMapper();
    return mapper.execute(result);
  }

  async findByRoomId(room: Room): Promise<CompetitorPriceEntity> {
    return await this.repository.findOne({
      where: {
        "room.remote_id": room.remote_id,
      },
    });
  }

  async update(hotel: Hotel): Promise<Hotel> {
    throw new Error("Method not implemented.");
  }
  async getAll(hotel: Hotel): Promise<Hotel[]> {
    throw new Error("Method not implemented.");
  }
  async findRoomDates(room_id: string): Promise<CompetitorPrice[]> {
    const mapper = new CompetitorPriceMapper();
    const response: CompetitorPrice[] = [];
    let manager = getConnection().mongoManager;
    let results = await manager
      .aggregate(CompetitorPriceEntity, [
        {
          $match: {
            "room.remote_id": room_id,
            date: {
              $gte: new Date("2022-02-01T00:00:00.000Z"),
              $lte: new Date("2022-03-03T00:00:00.000Z"),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$date" }, year: { $year: "$date" } },
            entity: {
              $push: {
                id: "$_id",
                name: "$name",
                date: "$date",
                room: "$room",
                price: "$price",
                room_id: "$room.remote_id",
                created_at: "$created_at",
                updated_at: "$updated_at",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    for (let x in results[0].entity) {
      let competitorPrice = mapper.fromAggregate(results[0].entity[x]);
      response.push(competitorPrice);
    }
    return response;
  }

  async findBestPrice(room_id: string, date: Date): Promise<CompetitorPrice> {
    const mapper = new CompetitorPriceMapper();

    let manager = getConnection().mongoManager;
    let results = await manager
      .aggregate(CompetitorPriceEntity, [
        {
          $match: {
            "room.remote_id": room_id,
            date: date,
          },
        },
        {
          $group: {
            _id: "$price.amount",
            prices: { $sum: "$price.amount" },
            avgQuantity: { $avg: "$price.amount" },
            entity: {
              $push: {
                id: "$_id",
                name: "$name",
                room_id: "$room.remote_id",
                date: "$date",
                room: "$room",
                price: "$price",
                created_at: "$created_at",
                updated_at: "$updated_at",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 1 },
      ])
      .toArray();

    return mapper.fromAggregate(results[0].entity[0]);
  }
  async findWorstPrice(room_id: string, date: Date): Promise<CompetitorPrice> {
    const mapper = new CompetitorPriceMapper();

    let manager = getConnection().mongoManager;
    let results = await manager
      .aggregate(CompetitorPriceEntity, [
        {
          $match: {
            "room.remote_id": room_id,
            date: date,
          },
        },
        {
          $group: {
            _id: "$price.amount",
            prices: { $sum: "$price.amount" },
            avgQuantity: { $avg: "$price.amount" },
            entity: {
              $push: {
                id: "$_id",
                name: "$name",
                room_id: "$room.remote_id",
                date: "$date",
                room: "$room",
                price: "$price",
                created_at: "$created_at",
                updated_at: "$updated_at",
              },
            },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    return mapper.fromAggregate(results[0].entity[0]);
  }

  async findAveragePrice(
    room_id: string,
    date: Date
  ): Promise<CompetitorPrice> {
    let prices = [];
    const mapper = new CompetitorPriceMapper();
    let manager = getConnection().mongoManager;
    let results = await manager
      .aggregate(CompetitorPriceEntity, [
        {
          $unwind: "$price",
        },
        {
          $match: {
            "room.remote_id": room_id,
            date: date,
          },
        },
        {
          $group: {
            _id: "$price.amount",
            price: { $sum: "$price.amount" },
          },
        },
      ])
      .toArray();

    //create array values
    for (let x in results) {
      prices.push(results[x].price);
    }

    //get the averga value
    let average: number = prices.reduce((sum, a) => sum + a, 0) / prices.length;
    // get the value closes to te average
    const output = prices.reduce((prev, curr) => {
      return Math.abs(curr - average) < Math.abs(prev - average) ? curr : prev;
    });
    //get the document with current data
    let result = await this.repository.findOne({
      where: {
        "room.remote_id": room_id,
        "price.amount": output,
        date: date,
      },
    });
    return mapper.fromAggregate(result);
  }
}
