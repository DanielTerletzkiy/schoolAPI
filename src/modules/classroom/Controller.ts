import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { IReq, IRes, UserRole } from "@src/routes/shared/types";
import { Classroom } from ".prisma/client";
import * as classroomService from "./Service";

/**
 * Get all classrooms.
 */
export async function getAll(_: IReq, res: IRes) {
  const classrooms = await classroomService.getAll();
  return res.status(HttpStatusCodes.OK).json(classrooms);
}

export async function getOne(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  const currentUser = res.locals.currentUser;
  const classrooms = await classroomService.get(currentUser, id);
  return res.status(HttpStatusCodes.OK).json(classrooms);
}

/**
 * Add one classroom.
 */
export async function add(req: IReq<Classroom>, res: IRes) {
  const classroom = req.body;
  await classroomService.addOne(classroom);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one classroom.
 */
export async function updateOne(req: IReq<Classroom>, res: IRes) {
  const classroom = req.body;
  const id = parseInt(req.params.id);
  await classroomService.updateOne(id, classroom);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one classroom.
 */
export async function deleteOne(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  await classroomService.deleteOne(id);
  return res.status(HttpStatusCodes.OK).end();
}
