import { User } from "src/shared/domain/model/user.model";
import { AuthChecker, ResolverData } from "type-graphql";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { user: User };
}

export const authChecker: AuthChecker<MyContext> = (
  { root, args, context, info },
  roles
) => {
  console.log(context.payload);

  return true; // or false if access is denied
};
