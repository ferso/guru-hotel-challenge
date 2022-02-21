import { MiddlewareFn, UnauthorizedError } from "type-graphql";
import { verify } from "jsonwebtoken";
import { UnauthorizedException } from "src/shared/exceptions/unauthorized.exception";
import { UnathenticatedException } from "src/shared/exceptions/unathenticated.exception";
import { RolesType } from "src/shared/domain/model/user.model";
import { MyContext } from "./is-auth.middleware";

export const UserGuardAccess: MiddlewareFn<MyContext> = ({ context }, next) => {
  let role = context.user.role;
  if (!context.authorized) {
    if (role !== RolesType.user) {
      throw new UnauthorizedException(
        "you don't have the necessary privileges to this resource"
      );
    }
  }
  context.authorized;
  return next();
};
