import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { RouteError } from "@src/declarations/classes";
import {
  getSplitAuthorizationHeader,
  parseJwt,
} from "@src/services/auth-service";
import EnvVars from "@src/declarations/major/EnvVars";

const NO_AUTH = "no authorization provided";
const INVALID_AUTH_TYPE = "invalid authorization type";
const EXPIRED_AUTH_TOKEN = "token has expired";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.get("Authorization");
  if (!authorization) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, NO_AUTH);
  }
  const { authorizationType, authorizationCode } =
    getSplitAuthorizationHeader(authorization);

  switch (authorizationType) {
    case "key": {
      break;
    }
    case "bearer": {
      const parsedJWT = await parseJwt(authorizationCode);
      const expiration = new Date(parsedJWT.exp * 1000);
      if (expiration.getTime() < new Date().getTime()) {
        throw new RouteError(HttpStatusCodes.UNAUTHORIZED, EXPIRED_AUTH_TOKEN);
      }
      res.locals.currentUser = parsedJWT;
      break;
    }
    default: {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_AUTH_TYPE);
    }
  }
  return next();
}

export function AuthCookieCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { key } = EnvVars.cookieProps;
  const token = (req.cookies as { [key]: string })[key];
  if (token && !req.headers.authorization) {
    req.headers.authorization = `Bearer ${token}`;
  }
  next();
}
