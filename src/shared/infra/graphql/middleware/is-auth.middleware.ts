import { MiddlewareFn, UnauthorizedError } from "type-graphql";
import { verify } from "jsonwebtoken";
import { UnauthorizedException } from "src/shared/exceptions/unauthorized.exception";
import { UnathenticatedException } from "src/shared/exceptions/unathenticated.exception";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { user_id: string };
}

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new UnauthorizedException("Authorization token required");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.APP_SECRET);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new UnathenticatedException("Not authenticated, no valid token");
  }
  return next();
};
