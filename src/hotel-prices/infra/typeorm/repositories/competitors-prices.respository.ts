import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { Service } from "typedi";
import { getConnection, getMongoRepository, MongoRepository } from "typeorm";
import { CompetitorPriceEntity } from "../entities/competitors-prices.entity";
import { CompetitorPriceMapper } from "../mappers/competitor-price.mapper";
import { RoomRepository } from "./room.respository";

@Service()
export class CompetitorsPricesRepository {
  repository: MongoRepository<CompetitorPriceEntity>;
  roomRepository: RoomRepository;
  constructor() {
    this.repository = getMongoRepository(CompetitorPriceEntity);
    this.roomRepository = new RoomRepository();
  }
  async saveEach(competitors: CompetitorPrice[]): Promise<unknown> {
    let bulk = await this.repository.initializeOrderedBulkOp();
    for (let x in competitors) {
      const mapper = new CompetitorPriceMapper();
      let competitor: CompetitorPrice = competitors[x];
      const where = {
        where: {
          room_remote_id: competitor.room.remote_id,
          date: competitor.date,
          name: competitor.name,
        },
      };
      bulk
        .find({
          room_remote_id: competitor.room.remote_id,
          date: competitor.date,
          name: competitor.name,
        })
        .upsert()
        .update({ $set: mapper.toEntity(competitor) });
    }
    await bulk.execute();

    return null;
  }

  async save(competitor: CompetitorPrice): Promise<CompetitorPrice> {
    let found = await this.findByValues(competitor);

    if (!found) {
      const mapper = new CompetitorPriceMapper();
      let result = await this.repository.save(competitor);
      return mapper.execute(result);
    }
    //updated record for this competitor
    competitor.updated_at = new Date();
    await this.repository.update(found.id, competitor);
    return found;
  }

  async findByValues(competitor: CompetitorPrice): Promise<CompetitorPrice> {
    const where = {
      where: {
        "room.remote_id": competitor.room.remote_id,
        date: competitor.date,
        name: competitor.name,
      },
    };
    console.log(where);
    const result = await this.repository.findOne();
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

    let results = await this.repository
      .aggregate([
        {
          $match: {
            "room.remote_id": room_id,
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

  async findBestPrice(
    room_id: string,
    room_type: string,
    date: Date
  ): Promise<CompetitorPrice> {
    const mapper = new CompetitorPriceMapper();

    let pipe = [
      {
        $match: {
          room_remote_id: room_id,
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
              room_id: "$room_remote_id",
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
    ];

    let results = await this.repository.aggregate(pipe).toArray();

    return mapper.fromAggregate(results[0]?.entity[0]);
  }
  async findWorstPrice(
    room_id: string,
    room_type: string,
    date: Date
  ): Promise<CompetitorPrice> {
    const mapper = new CompetitorPriceMapper();

    const pipe = [
      {
        $match: {
          room_remote_id: room_id,
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
              room_id: "$room_emote_id",
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
    ];

    let results = await this.repository.aggregate(pipe).toArray();

    return mapper.fromAggregate(results[0]?.entity[0]);
  }

  async findAveragePrice(
    room_id: string,
    room_type: string,
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
            room_remote_id: room_id,
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

    if (results.length > 0) {
      //create array values
      for (let x in results) {
        prices.push(results[x]?.price);
      }

      //get the averga value
      let average: number =
        prices.reduce((sum, a) => sum + a, 0) / prices.length;
      // get the value closes to te average
      const output = prices?.reduce((prev, curr) => {
        return Math.abs(curr - average) < Math.abs(prev - average)
          ? curr
          : prev;
      });
      //get the document with current data
      let result = await this.repository.findOne({
        where: {
          room_remote_id: room_id,
          "price.amount": output,
          date: date,
        },
      });
      return mapper.fromAggregate(result);
    }
    return null;
  }

  async getByRoomAndDates(
    room: Room,
    start: string,
    end: string
  ): Promise<CompetitorPrice[]> {
    const where = {
      where: {
        room_remote_id: room.remote_id,
        date: { $gte: new Date(start), $lte: new Date(end) },
      },
    };

    const mapper = new CompetitorPriceMapper();
    let competitors = [];
    let results = await this.repository.find(where);

    for (let x in results) {
      competitors.push(mapper.execute(results[x]));
    }
    return competitors;
  }
}
