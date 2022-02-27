import EventEmitter from "events";
import { HandlerBaseEvent } from "src/shared/domain/events/handler-base";
import { EventNotifier } from "../../../hotel-prices/domain/events/event.notifier";

export class Events {
  private static instance: Events;
  private static suscribers = {};
  channel: EventEmitter;
  constructor() {
    this.channel = new EventEmitter.EventEmitter();
  }

  async emit(event: EventNotifier) {
    let instance = Events.suscribers[event.constructor.name];
    await instance.execute(event);
  }

  suscribe(suscriber: string, handler: any) {
    Events.suscribers[suscriber] = handler as HandlerBaseEvent;
  }

  public static getInstance(): Events {
    if (!Events.instance) {
      Events.instance = new Events();
    }
    return Events.instance;
  }
}

export default new Events();
