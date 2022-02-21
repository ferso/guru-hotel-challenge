import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { IHotelRepository } from "src/hotel-prices/domain/repositories/hotel.repository";
import {
  getConnection,
  MongoClient,
  MongoRepository,
  getMongoRepository,
} from "typeorm";
import { HotelEntity } from "src/hotel-prices/infra/typeorm/entities/hotel.entity";
import { HotelMapper } from "src/hotel-prices/infra/typeorm/mappers/Hotel.mapper";

export class HotelRepository implements IHotelRepository {
  hotelRepository: MongoRepository<HotelEntity>;
  constructor() {
    this.hotelRepository = getMongoRepository(HotelEntity);
  }
  async save(hotel: Hotel): Promise<Hotel> {
    let result: HotelEntity;
    let hotelSaved = await this.getByRemoteId(hotel.remote_id);
    if (hotelSaved) {
      await this.hotelRepository.update(
        { remote_id: hotel.remote_id },
        {
          rooms: hotel.rooms,
          city: hotel.city,
          state: hotel.state,
          name: hotel.name,
          updated_at: new Date(),
        }
      );
      return await this.getByRemoteId(hotel.remote_id);
    }
    result = await this.hotelRepository.save({
      remote_id: hotel.remote_id,
      rooms: hotel.rooms,
      city: hotel.city,
      state: hotel.state,
      name: hotel.name,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return new HotelMapper(result).execute();
  }

  async getByRemoteId(id: any): Promise<Hotel> {
    const result = await this.hotelRepository.findOne({
      remote_id: id,
    });
    return new HotelMapper(result).execute();
  }

  async getByIdentifier(id: any): Promise<Hotel> {
    const result = await this.hotelRepository.findOne({
      where: {
        $or: [
          {
            id: id,
          },
          {
            remote_id: id,
          },
        ],
      },
    });
    return new HotelMapper(result).execute();
  }

  async getCheckUpdate(id: any): Promise<boolean> {
    const maxTimeToUpdate = 1;
    let results = await this.hotelRepository
      .aggregate([
        {
          $match: { remote_id: id },
        },
        {
          $project: {
            difference: {
              $divide: [{ $subtract: [new Date(), "$updated_at"] }, 1000 * 60],
            },
          },
        },
      ])
      .toArray();

    if (results.length > 0) {
      return results[0].difference > maxTimeToUpdate;
    }
    return true;
  }

  async getById(hotel: Hotel): Promise<Hotel> {
    const result = await this.hotelRepository.save({ id: hotel.id });
    return null;
  }

  update(hotel: Hotel): Promise<Hotel> {
    throw new Error("Method not implemented.");
  }
  getAll(hotel: Hotel): Promise<Hotel[]> {
    throw new Error("Method not implemented.");
  }

  async ping(): Promise<any> {
    try {
      const config = {
        connectTimeoutMS: 3,
        useUnifiedTopology: true,
      };
      let connection = this.hotelRepository.manager.connection;
      const mongodb = (connection.driver as any).mongodb;
      let client: MongoClient = new mongodb.MongoClient(
        "mongodb://localhost:27017/hotel-price-api",
        config
      ); //
      client.connect();
      let tm = setTimeout(() => {
        client.close();
        return false;
      }, 50);
      await client.db().admin().serverStatus();
      clearTimeout(tm);
      client.close();
      return true;
    } catch (error) {
      return false;
    }
  }
}
