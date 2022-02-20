import { MiddlewareFn, UnauthorizedError } from "type-graphql";
import { verify } from "jsonwebtoken";
import { UnauthorizedException } from "src/shared/exceptions/unauthorized.exception";
import { UnathenticatedException } from "src/shared/exceptions/unathenticated.exception";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { role: string };
}

export const AdminGuardAccess: MiddlewareFn<MyContext> = (
  { context },
  next
) => {
  let role = context.payload.role;
  if (role !== "admin") {
    throw new UnauthorizedException("Authorization token required");
  }

  return next();
};
