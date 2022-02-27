import { Service } from "typedi";
import { CreateUserService } from "src/shared/application/services/create-user.service";
import { LoginUserService } from "src/shared/application/services/login-user.service";
import { Logger } from "src/shared/infra/logger/logger";
import {
  Resolver,
  Mutation,
  Arg,
  registerEnumType,
  Args,
  Authorized,
} from "type-graphql";
import { EncryptPasswordService } from "../../adapter/encrypt-password.adapter";
import { CreateUserInput } from "../types/create-user.input.type";
import { LoginResponse } from "../types/login-response.type";
import { RolesType } from "src/shared/domain/enums/roles-type";

registerEnumType(RolesType, {
  name: "RolesType",
  description: "Roles types allow are USER, ADMIN",
});

@Service()
@Resolver()
export class UserResolver {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  @Mutation(() => LoginResponse)
  async Login(@Arg("email") email: string, @Arg("password") password: string) {
    const loginUserService = new LoginUserService();
    let user = await loginUserService.execute(email, password);
    return {
      accessToken: user.getToken(),
    };
  }

  @Authorized([RolesType.admin])
  @Mutation(() => Boolean)
  async createUser(@Args() input: CreateUserInput) {
    const createUserService = new CreateUserService(
      new EncryptPasswordService()
    );
    await createUserService.execute(
      input.email,
      input.password,
      input.name,
      input.role
    );
    return true;
  }
}
