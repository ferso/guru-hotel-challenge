import { ErrorBase } from "./error-base.exception";

export class UnauthorizedException extends ErrorBase {
  name: string = "UNAUTHORIZED_EXCEPTION";
  constructor(message: string) {
    super(message);
  }
}
