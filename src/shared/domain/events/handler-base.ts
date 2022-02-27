import { EventNotifier } from "src/hotel-prices/domain/events/event.notifier";

export abstract class HandlerBaseEvent {
  async execute(event: EventNotifier): Promise<void> {}
}
