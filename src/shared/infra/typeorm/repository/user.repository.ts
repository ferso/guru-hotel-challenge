import { getRepository, Repository } from "typeorm";
import { User } from "src/shared/domain/model/user.model";
import { UserEntity } from "src/shared/infra/typeorm/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";
import { UserAlreadyExistException } from "src/shared/exceptions/user-already-exists.exception";

export class UserRepository {
  repository: Repository<UserEntity>;
  constructor() {
    this.repository = getRepository(UserEntity);
  }
  async create(user: User): Promise<User> {
    let result = await this.findByEmail(user);
    if (result) {
      throw new UserAlreadyExistException("User already exist");
    }

    let entity = await this.repository.save({
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.getPassword(),
    });
    return new UserMapper().fromEntity(entity);
  }

  async findByEmail(user: User): Promise<User> {
    let entity = await this.repository.findOne({ email: user.email });

    return new UserMapper().fromEntity(entity);
  }
}
