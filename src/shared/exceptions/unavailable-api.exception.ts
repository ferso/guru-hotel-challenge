import { ErrorBase } from "./error-base.exception";

export class UnAvailbleApiError extends ErrorBase {
  name: string = "UNAVAIBLE_REMOTE_API";
  constructor(message: string) {
    super(message);
  }
}
