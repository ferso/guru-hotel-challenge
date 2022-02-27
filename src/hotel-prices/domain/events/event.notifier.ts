export interface IMessage {}

export class EventNotifier implements IMessage {
  constructor(public readonly aggregateId: string) {}
}
