import { EventNotifier } from "src/hotel-prices/domain/events/event.notifier";
import { UserRepository } from "src/shared/infra/typeorm/repository/user.repository";
import { User } from "../../domain/model/user.model";
import { HandlerBaseEvent } from "../../domain/events/handler-base";

export class CreateUserHandler extends HandlerBaseEvent {
  constructor(private repository: UserRepository) {
    super();
  }
  async execute(event: EventNotifier): Promise<void> {
    console.log(event);
    // let user: User = event["user"];
    // try {
    //   await this.repository.create(user);
    // } catch (error) {
    //   console.log("error");
    // }
  }
}
