import { RolesType } from "src/shared/domain/enums/roles-type";
import { User } from "src/shared/domain/model/user.model";
import { EncryptPasswordService } from "src/shared/infra/adapter/encrypt-password.adapter";
import { UserRepository } from "src/shared/infra/typeorm/repository/user.repository";

export class CreateUserService {
  userRepository: UserRepository;
  constructor(private encripter: EncryptPasswordService) {
    this.userRepository = new UserRepository();
  }
  async execute(email: string, password: string, name: string, role: string) {
    let user = new User({
      email,
      name,
      role: RolesType[role],
    });

    let hashedPassword = await this.encripter.execute(password);
    user.setPassword(hashedPassword);

    return await this.userRepository.create(user);
  }
}
