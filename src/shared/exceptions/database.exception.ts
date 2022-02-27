import { ErrorBase } from "./error-base.exception";

export class DatabaseException extends ErrorBase {
  name: string = "DATABASE_EXCEPTION";
  constructor(message: string) {
    super(message);
  }
}
