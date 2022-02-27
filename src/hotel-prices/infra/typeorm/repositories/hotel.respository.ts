import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { IHotelRepository } from "src/hotel-prices/domain/repositories/hotel.repository";
import { MongoClient, MongoRepository, getMongoRepository } from "typeorm";
import { HotelEntity } from "src/hotel-prices/infra/typeorm/entities/hotel.entity";
import { HotelMapper } from "src/hotel-prices/infra/typeorm/mappers/hotel.mapper";
import { Logger } from "src/shared/infra/logger/logger";
import { stat } from "fs";
import { UnAvailbleApiError } from "src/shared/exceptions/unavailable-api.exception";
import { DatabaseException } from "src/shared/exceptions/database.exception";
import { Service } from "typedi";

@Service()
export class HotelRepository implements IHotelRepository {
  hotelRepository: MongoRepository<HotelEntity>;
  logger: Logger;
  constructor() {
    this.logger = new Logger();
    try {
      this.hotelRepository = getMongoRepository(HotelEntity);
    } catch (error) {
      throw new DatabaseException("Database is not available");
    }
  }
  async save(hotel: Hotel): Promise<Hotel> {
    let result: HotelEntity;
    let hotelSaved = await this.getByRemoteId(hotel.remote_id);
    if (hotelSaved) {
      await this.hotelRepository.update(
        { remote_id: hotel.remote_id },
        {
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

  async ping(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        this.hotelRepository
          .stats()
          .then(() => {
            clearTimeout(tm);
            return resolve(true);
          })
          .catch(() => reject(false));
        let tm = setTimeout(() => {
          this.logger.error("Database timeout");
          return reject(false);
        }, 50);
      } catch (error) {
        console.error("jere");
        throw new DatabaseException(error.message);
      }
    });
  }
}
