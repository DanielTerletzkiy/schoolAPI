import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { IReq, IRes, UserRole } from "@src/routes/shared/types";
import { User } from ".prisma/client";
import * as userService from "./Service";

/**
 * Get all users.
 */
export async function getAll(_: IReq, res: IRes) {
  const users = await userService.getAll();
  return res.status(HttpStatusCodes.OK).json(users);
}

export async function getOne(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  const users = await userService.get(id);
  return res.status(HttpStatusCodes.OK).json(users);
}

export async function getCurrent(req: IReq, res: IRes) {
  const currentUser = res.locals.currentUser;
  const users = await userService.get(currentUser.id);
  return res.status(HttpStatusCodes.OK).json(users);
}

/**
 * Add one user.
 */
export async function add(req: IReq<User>, res: IRes) {
  const user = req.body;
  await userService.addOne(user);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
export async function updateOne(req: IReq<User>, res: IRes) {
  const user = req.body;
  const id = parseInt(req.params.id);
  await userService.updateOne(id, user);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
export async function deleteOne(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  await userService.deleteOne(id);
  return res.status(HttpStatusCodes.OK).end();
}
