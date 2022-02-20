import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { IHotelRepository } from "src/hotel-prices/domain/repositories/hotel.repository";
import { getConnection, getRepository, Repository } from "typeorm";
import { HotelEntity } from "src/hotel-prices/infra/typeorm/entities/hotel.entity";
import { HotelMapper } from "src/hotel-prices/infra/typeorm/mappers/Hotel.mapper";

export class HotelRepository implements IHotelRepository {
  hotelRepository: Repository<HotelEntity>;
  constructor() {
    this.hotelRepository = getRepository(HotelEntity);
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
    let manager = getConnection().mongoManager;
    let results = await manager
      .aggregate(HotelEntity, [
        {
          $match: { remote_id: 1 },
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
}
