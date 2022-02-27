import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { getMongoRepository, MongoRepository } from "typeorm";
import { RoomEntity } from "../entities/room.entity";
import { RoomMapper } from "../mappers/room.mapper";
import { Service } from "typedi";

@Service()
export class RoomRepository {
  repository: MongoRepository<RoomEntity>;
  constructor() {
    this.repository = getMongoRepository(RoomEntity);
  }
  async saveEach(rooms: Room[], hotel: Hotel): Promise<Room[]> {
    let nrooms = [];
    delete hotel.rooms;
    for (let x in rooms) {
      let room = rooms[x];
      room.setHotel(hotel);
      let result = await this.findByOneRemoteId(room);
      if (!result) {
        result = await this.create(room);
      }
      nrooms.push(result);
    }
    return null;
  }

  async create(room: Room): Promise<Room> {
    // let result = await this.repository.save(RoomMapper.toEntity(room));
    let result = await this.repository.save(RoomMapper.toEntity(room));
    return RoomMapper.fromEntity(result);
  }
  async findByOneRemoteId(room: Room): Promise<Room> {
    let result = await this.repository.findOne({ remote_id: room.remote_id });
    return RoomMapper.fromEntity(result);
  }

  async getAllByHotel(hotel: Hotel, limit?: number): Promise<Room[]> {
    let rooms = [];
    let query: any = {
      where: {
        remote_hotel_id: hotel.remote_id,
      },
    };
    // if (limit) {
    //   query.limit = limit;
    // }

    let results = await this.repository.find(query);
    for (let x in results) {
      rooms.push(RoomMapper.fromEntity(results[x]));
    }
    return rooms;
  }
}
