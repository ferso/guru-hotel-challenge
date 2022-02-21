import { MiddlewareFn, NextFn, UnauthorizedError } from "type-graphql";
import { verify } from "jsonwebtoken";
import { UnauthorizedException } from "src/shared/exceptions/unauthorized.exception";
import { UnathenticatedException } from "src/shared/exceptions/unathenticated.exception";
import { RolesType } from "src/shared/domain/model/user.model";
import { MyContext } from "./is-auth.middleware";

export const AdminGuardAccess: MiddlewareFn<MyContext> = (
  { context },
  next
) => {
  if (!context.authorized) {
    let role = context.user.role;
    if (role !== RolesType.admin) {
      throw new UnauthorizedException(
        "you don't have the necessary privileges to this resource, admin role is required"
      );
    }
    context.authorized = true;
  }

  return next();
};
