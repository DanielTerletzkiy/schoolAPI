import * as userRepo from "@src/modules/user/Repository";
import jwtUtil from "@src/util/jwt-util";
import pwdUtil from "@src/util/pwd-util";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { RouteError } from "@src/declarations/classes";
import { tick } from "@src/declarations/functions";
import { AccessToken } from "@src/routes/shared/types";
import EnvVars from "@src/declarations/major/EnvVars";

// **** Variables **** //

// Errors
export const errors = {
  unauth: "Unauthorized",
  emailNotFound: (email: string) => `User with email "${email}" not found`,
} as const;

// **** Functions **** //

/**
 * Login a user.
 */
export async function getJwt(email: string, password: string): Promise<string> {
  // Fetch user
  const user = await userRepo.getOneByEmail(email);
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      errors.emailNotFound(email)
    );
  }
  // Check password
  const pwdPassed = await pwdUtil.compare(password, user.hash);
  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, errors.unauth);
  }
  return jwtUtil.sign({
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
  });
}

export async function parseJwt(token: string): Promise<AccessToken> {
  return <AccessToken> await jwtUtil.decode(token);
}

export function getSplitAuthorizationHeader(authorization: string){
  const authRegex = authorization.match(new RegExp("(.*)\\s(.*)"));
  if (!authRegex || !authRegex.length) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, errors.unauth);
  }
  const authorizationType = authRegex[1].trim().toLowerCase();
  const authorizationCode = authRegex[2].trim();

  return {authorizationCode, authorizationType};
}

export function checkCookieToken(cookie: string){
  const { key } = EnvVars.cookieProps;
  return cookie.includes(key);
}

export function cookieToToken(cookie: string){
  const { key } = EnvVars.cookieProps;
  return cookie.replace(`${key}=`,'').trim();
}
