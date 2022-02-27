import { User } from "src/shared/domain/model/user.model";
import { UnAuthorizedException } from "src/shared/exceptions/unauthorized.exception";
import { AuthCheckerInterface, ResolverData } from "type-graphql";
import { Service } from "typedi";
import { verify } from "jsonwebtoken";
import { UserRepository } from "../../typeorm/repository/user.repository";

export interface MyContext {
  req: Request;
  res: Response;
  user?: User;
  payload?: { user: User };
}

@Service()
export class CustomAuthChecker implements AuthCheckerInterface<MyContext> {
  async check(
    { root, args, context, info }: ResolverData<MyContext>,
    roles: string[]
  ) {
    let userRepository = new UserRepository();
    let user: User;
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
      throw new UnAuthorizedException("Authorization token required");
    }

    try {
      const token = authorization.split(" ")[1];
      const payload = verify(token, process.env.APP_SECRET);

      user = new User({
        role: payload.role,
        email: payload.email,
      });

      user = await userRepository.findByEmail(user);
      user.setToken(token);
      if (!user) {
        throw new UnAuthorizedException("Not authenticated, no valid token");
      }

      context.user = user;
    } catch (err) {
      console.log(err);
      throw new UnAuthorizedException("Not authenticated, no valid token");
    }

    if (!roles.includes(user.role)) {
      throw new UnAuthorizedException(
        "You do not have the permissions to performance this action"
      );
    }

    return true;
  }
}
