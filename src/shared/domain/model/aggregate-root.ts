import { EventNotifier } from "src/hotel-prices/domain/events/event.notifier";
import Events from "src/shared/domain/events/events";

export abstract class AggregateRoot {
  id?: string;
  async emit(event: EventNotifier) {
    await Events.emit(event);
  }
  getId(): string {
    return this.id;
  }
}
