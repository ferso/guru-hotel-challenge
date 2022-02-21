import { MiddlewareFn, UnauthorizedError } from "type-graphql";
import { verify } from "jsonwebtoken";
import { UnauthorizedException } from "src/shared/exceptions/unauthorized.exception";
import { UnathenticatedException } from "src/shared/exceptions/unathenticated.exception";
import { User } from "src/shared/domain/model/user.model";
import { Request } from "express";

export interface MyContext {
  req: Request;
  res: Response;
  user?: User;
  authorized: boolean;
}

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new UnauthorizedException("Authorization token required");
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.APP_SECRET);

    let user = new User({
      name: "",
      role: payload.role,
      email: payload.email,
    });

    context.user = user;
  } catch (err) {
    console.log(err);
    throw new UnathenticatedException("Not authenticated, no valid token");
  }

  return next();
};
