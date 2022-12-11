import { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { RouteError } from "@src/declarations/classes";
import {
  getSplitAuthorizationHeader,
  parseJwt,
} from "@src/services/auth-service";
import * as userRepo from "@src/modules/user/Repository";
import { UserRole } from "@src/routes/shared/types";

const NO_AUTH = "no authorization provided";
const INVALID_AUTH = "not authorized on endpoint";

export default function (
  permissions: UserRole[]
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const authorization = req.get("Authorization");
    if (!authorization) {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, NO_AUTH);
    }
    const { authorizationCode } = getSplitAuthorizationHeader(authorization);
    const parsedJWT = await parseJwt(authorizationCode);
    const userId = parsedJWT.id;
    const user = await userRepo.getOneById(userId);
    if (!user) {
      throw new RouteError(HttpStatusCodes.UNAUTHORIZED, NO_AUTH);
    }
    if (permissions.includes(user.roleId)) {
      return next();
    }
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, INVALID_AUTH);
  };
}
