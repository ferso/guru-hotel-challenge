import { RolesType } from "src/shared/domain/enums/roles-type";
import { User } from "src/shared/domain/model/user.model";
import { GenerateAuthToken } from "src/shared/infra/adapter/generate-auth-token";
import { Logger } from "src/shared/infra/logger/logger";
import { UserRepository } from "src/shared/infra/typeorm/repository/user.repository";

export class SeedService {
  logger: Logger;
  userRepository: UserRepository;
  constructor() {
    this.logger = new Logger();
    this.userRepository = new UserRepository();
  }
  async execute() {
    let user1 = new User({
      name: "Admin",
      password: "12345678",
      email: "admin@guruhotel.com",
      role: RolesType.admin,
    });

    let user2 = new User({
      name: "User",
      password: "12345678",
      email: "user@guruhotel.com",
      role: RolesType.user,
    });

    await this.userRepository.create(user1).catch((error) => {});
    await this.userRepository.create(user2).catch((error) => {});
    this.logger.info(
      "Admin created {admin@guruhotel.com} password is: {12345678}"
    );
    this.logger.info(
      "User created {user@guruhotel.com} password is: {12345678}"
    );
  }
}
