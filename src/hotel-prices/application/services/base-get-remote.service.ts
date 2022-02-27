import md5 from "md5";
import { CompetitorPrice } from "src/hotel-prices/domain/model/competitor-price.model";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { CompetitorsPricesRepository } from "src/hotel-prices/infra/typeorm/repositories/competitors-prices.respository";
import { HotelRepository } from "src/hotel-prices/infra/typeorm/repositories/hotel.respository";
import { RoomRepository } from "src/hotel-prices/infra/typeorm/repositories/room.respository";
import { Logger } from "src/shared/infra/logger/logger";
import { CacheRepository } from "src/shared/infra/typeorm/repository/cache.repository";
export class BaseGetRemoteService {
  results: any;
  cacheKey: string;
  cacheArgs: any;
  cache: any;
  hotel: Hotel;
  logger: Logger;
  rooms: Room[] = [];
  competitors: CompetitorPrice[] = [];
  roomRepository: RoomRepository;
  hotelRepository: HotelRepository;
  cacheRepository: CacheRepository;
  competitorsPricesRepository: CompetitorsPricesRepository;
  constructor() {
    this.logger = new Logger();
    this.roomRepository = new RoomRepository();
    this.hotelRepository = new HotelRepository();
    this.cacheRepository = new CacheRepository();
    this.competitorsPricesRepository = new CompetitorsPricesRepository();
  }
  setCacheKey(args: any) {
    let str = "";
    for (let x in args) {
      str += `${args[x]}-`;
    }
    this.cacheKey = md5(str);
  }
  setCacheArgs(args: any) {
    this.cacheArgs = args;
  }
  async isNeededFetching(args: any) {
    this.setCacheArgs(args);
    this.setCacheKey(args);
    this.cache = await this.cacheRepository.getByKey(this.cacheKey);
    return this.cache || false;
  }
  async saveFetch(hotel: Hotel, competitors: CompetitorPrice[]) {
    this.hotel = await this.hotelRepository.save(hotel);
    this.rooms = await this.roomRepository.saveEach(hotel.rooms, this.hotel);
    await this.competitorsPricesRepository.saveEach(competitors);
  }
  async saveCache() {
    return await this.cacheRepository.create(
      this.cacheKey,
      this.cacheArgs,
      this.results
    );
  }
}
