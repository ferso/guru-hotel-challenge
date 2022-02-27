import { hash, compare } from "bcryptjs";

export class EncryptPasswordService {
  async execute(password: string): Promise<string> {
    const hashedPassword = await hash(password, 13);
    return hashedPassword;
  }
}
