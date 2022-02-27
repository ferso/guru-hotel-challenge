import { HandlerBaseEvent } from "src/shared/domain/events/handler-base";
import { EventNotifier } from "../../domain/events/event.notifier";

export class HotelCreateHandler extends HandlerBaseEvent {
  async execute(event: EventNotifier): Promise<void> {
    console.log(event);
  }
}
