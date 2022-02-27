import { ErrorBase } from "./error-base.exception";

export class UnathenticatedException extends ErrorBase {
  name: string = "UNAUTHENTICATED_EXCEPTION";
  constructor(message: string) {
    super(message);
  }
}
