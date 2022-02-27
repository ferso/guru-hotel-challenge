import { Hotel } from "../../model/hotel.model";
import { EventNotifier } from "../event.notifier";

export class HotelCreatEvent extends EventNotifier {
  constructor(public readonly hotel: Hotel) {
    super(hotel.id);
  }
}
