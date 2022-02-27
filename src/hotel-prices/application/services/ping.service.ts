import { RemotePingService } from "src/hotel-prices/infra/remote-api/remote-ping.service.adapter";
import { HotelRepository } from "src/hotel-prices/infra/typeorm/repositories/hotel.respository";
import { Logger } from "src/shared/infra/logger/logger";
import { Service } from "typedi";

@Service()
export class PingService {
  hotelRepository: HotelRepository;
  remotePingService: RemotePingService;
  logger: Logger;
  constructor() {
    this.logger = new Logger();
    this.hotelRepository = new HotelRepository();
    this.remotePingService = new RemotePingService();
  }
  async execute() {
    try {
      let [db, external_api] = await Promise.all([
        this.hotelRepository.ping().catch((error) => false),
        this.remotePingService.execute().catch((error) => false),
      ]);

      return {
        db,
        external_api,
        local_api: true,
      };
    } catch (error) {
      return null;
    }
  }
}
