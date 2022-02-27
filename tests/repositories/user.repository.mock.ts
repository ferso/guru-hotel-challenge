import { User } from "src/shared/domain/model/user.model";
import { Logger } from "src/shared/infra/logger/logger";
import { UserEntity } from "src/shared/infra/typeorm/entities/user.entity";
import { UserRepository } from "src/shared/infra/typeorm/repository/user.repository";
import { Repository } from "typeorm";

export class UserRepositoryMock implements UserRepository {
  repository: Repository<UserEntity>;
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  async create(user: User): Promise<User> {
    return user;
  }
  async findByEmail(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
