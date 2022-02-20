import axios, { AxiosStatic } from "axios";
import { Hotel } from "src/hotel-prices/domain/model/hotel.model";
import { Room } from "src/hotel-prices/domain/model/room.model";
import { UnAvailbleApiError } from "src/shared/exceptions/unavailable-api.exception";
import { Logger } from "src/shared/infra/logger/logger";

export class RemotePingService {
  http: AxiosStatic;
  id: number;
  logger: Logger;
  constructor() {
    this.logger = new Logger();
    this.http = axios;
  }
  async execute(): Promise<any> {
    try {
      let result = await this.http.get(`http://localhost:5000/ping`);
      return result.data;
    } catch (error) {
      this.logger.error(error.toString());
      throw new UnAvailbleApiError("Remote api is unavailble");
    }
  }
  mapper(payload: any, id: number): Hotel {
    const hotel = new Hotel({
      name: payload?.name,
      city: payload?.city,
      state: payload?.state,
      remote_id: id,
    });
    for (let x in payload.rooms) {
      let room = new Room({
        remote_id: payload.rooms[x].room_id,
        name: payload.rooms[x].room_name,
        type: payload.rooms[x].room_type,
        bed_count: payload.rooms[x].bed_count,
        amenities: payload.rooms[x].amenities,
      });
      hotel.setRoom(room);
    }
    return hotel;
  }
}
