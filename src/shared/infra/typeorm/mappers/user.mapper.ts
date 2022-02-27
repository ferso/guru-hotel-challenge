import { RolesType } from "src/shared/domain/enums/roles-type";
import { User } from "src/shared/domain/model/user.model";
import { UserEntity } from "../entities/user.entity";

export class UserMapper {
  fromEntity(entity: UserEntity): User {
    if (entity) {
      let user = new User({
        id: String(entity.id),
        name: entity.name,
        email: entity.email,
        role: RolesType[entity.role],
        password: entity.password,
      });
      return user;
    }

    return null;
  }
}
