import { HotelRepository } from "src/hotel-prices/infra/typeorm/repositories/hotel.respository";

export class PingDatabaseStatus {
  hotelRepository: HotelRepository;
  constructor() {
    this.hotelRepository = new HotelRepository();
  }

  async execute() {
    return await this.hotelRepository.ping();
  }
}
