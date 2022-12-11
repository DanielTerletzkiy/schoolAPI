import jsonwebtoken from "jsonwebtoken";
import EnvVars from "../declarations/major/EnvVars";
import { RouteError } from "@src/declarations/classes";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";

// **** Variables **** //

// Errors
const errors = {
  validation: "JSON-web-token validation failed.",
} as const;

// Options
const options = {
  expiresIn: EnvVars.jwt.exp,
};

// **** Functions **** //

/**
 * Encrypt data and return jwt.
 */
function sign(data: string | object | Buffer): Promise<string> {
  return new Promise((res, rej) => {
    jsonwebtoken.sign(data, EnvVars.jwt.secret, options, (err, token) => {
      return err ? rej(err) : res(token || "");
    });
  });
}

/**
 * Decrypt JWT and extract client data.
 */
async function decode<T>(jwt: string): Promise<string | undefined | T> {
  return new Promise((res) => {
    jsonwebtoken.verify(jwt, EnvVars.jwt.secret, (err, decoded) => {
      if (err) {
        throw new RouteError(HttpStatusCodes.UNAUTHORIZED, errors.validation);
      }
      return res(decoded as T);
    });
  });
}

// **** Export default **** //

export default {
  sign,
  decode,
} as const;
