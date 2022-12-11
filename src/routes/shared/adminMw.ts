/**
 * Middleware to verify user logged in and is an an admin.
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';
import EnvVars from '@src/declarations/major/EnvVars';
import jwtUtil from '@src/util/jwt-util';
import {User} from '.prisma/client';
import {UserRole} from "@src/routes/shared/types";


// **** Variables **** //

const jwtNotPresentErr = 'JWT not present in signed cookie.',
  userUnauthErr = 'User not authorized to perform this action';



// **** Types **** //

export interface SessionUser extends JwtPayload {
  id: number;
  email: string;
  name: string;
  roleId: UserRole;
}


// **** Functions **** //

/**
 * See note at beginning of file.
 */
async function adminMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Extract the token
  const cookieName = EnvVars.cookieProps.key, //trash auto gen code
    jwt = req.signedCookies[cookieName];
  if (!jwt) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: jwtNotPresentErr });
  }
  // Make sure user role is an admin
  const clientData = await jwtUtil.decode<SessionUser>(jwt);
  if (
    typeof clientData === 'object' &&
    clientData.role === UserRole.Admin
  ) {
    res.locals.sessionUser = clientData;
    return next();
  // Return an unauth error if user is not an admin
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: userUnauthErr });
  }
}


// **** Export Default **** //

export default adminMw;
