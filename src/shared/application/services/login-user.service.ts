import { verify } from "jsonwebtoken";
import { User } from "src/shared/domain/model/user.model";
import { GenerateAuthToken } from "src/shared/infra/adapter/generate-auth-token";
import { UserRepository } from "src/shared/infra/typeorm/repository/user.repository";

export class LoginUserService {
  userRepository: UserRepository;
  generateAuthToken: GenerateAuthToken;
  constructor() {
    this.generateAuthToken = new GenerateAuthToken();
    this.userRepository = new UserRepository();
  }
  async execute(email: string, password: string): Promise<User> {
    let user = new User({
      email: email,
      password: password,
    });
    user = await this.userRepository.findByEmail(user);
    let token = await this.generateAuthToken.execute(user);
    user.setToken(token);
    return user;
  }
}
