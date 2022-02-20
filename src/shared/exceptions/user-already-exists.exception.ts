import { ErrorBase } from "./error-base.exception";

export class UserAlreadyExistException extends ErrorBase {
  name: string = "USER_ALREADY_EXIST_EXCEPTION";
  constructor(message: string) {
    super(message);
  }
}
