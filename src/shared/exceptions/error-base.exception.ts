export class ErrorBase extends Error {
  name: string;
  message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}
