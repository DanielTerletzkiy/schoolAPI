import * as e from "express";
import { Query } from "express-serve-static-core";

import { SessionUser } from "@src/routes/shared/adminMw";

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body: U;
}

export interface IRes extends e.Response {
  locals: {
    currentUser: SessionUser;
  };
}

export enum UserRole {
  Admin = 1,
  Teacher = 2,
  Student = 3,
}

export enum HTTP {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
  OPTIONS = "options",
  HEAD = "head",
}

export enum Day {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}

export type RoutePath = {
  path: string;
  method: HTTP;
  permissions: Array<UserRole>;
  function: (req: IReq<never>, res: IRes) => Promise<IRes>;
};

export type ModuleRoutePath = { [key: string]: RoutePath };

export type AccessToken = {
  id: number;
  sub: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
};
