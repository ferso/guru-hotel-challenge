import { EventNotifier } from "src/hotel-prices/domain/events/event.notifier";
import { User } from "../model/user.model";
export class CreateUserEvent extends EventNotifier {
  constructor(public readonly user: User) {
    super(user.id);
  }
}
