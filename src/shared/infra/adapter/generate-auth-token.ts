import * as jwt from "jsonwebtoken";
import { User } from "src/shared/domain/model/user.model";

export class GenerateAuthToken {
  async execute(user: User): Promise<string> {
    const token = jwt.sign(user.serialize(), process.env.APP_SECRET);
    return token;
  }
}
