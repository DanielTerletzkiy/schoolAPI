import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { IReq, IRes } from "@src/routes/shared/types";
import { Schedule, Timetable } from ".prisma/client";
import * as service from "./Service";
import { current } from "@src/modules/classroom/Repository";

/**
 * Get all timetables.
 */
export async function getAll(req: IReq, res: IRes) {
  const classroomId = await currentClassroomId(req, res);
  const timetables = await service.getAll(classroomId);
  return res.status(HttpStatusCodes.OK).json(timetables);
}

/**
 * Get one timetable.
 */
export async function getOne(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  const timetable = await service.get(id);
  return res.status(HttpStatusCodes.OK).json(timetable);
}

/**
 * Get current timetable.
 */
export async function getCurrent(req: IReq, res: IRes) {
  const classroomId = await currentClassroomId(req, res);
  const timetable = await service.getCurrent(classroomId);
  return res.status(HttpStatusCodes.OK).json(timetable);
}

/**
 * Add one timetable.
 */
export async function add(req: IReq<Timetable>, res: IRes) {
  const timetable = req.body;
  const classroomId = await currentClassroomId(req, res);
  await service.addOne(classroomId, timetable);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one timetable.
 */
export async function updateOne(req: IReq<Timetable>, res: IRes) {
  const timetable = req.body;
  const id = parseInt(req.params.id);
  await service.updateOne(id, timetable);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one timetable.
 */
export async function deleteOne(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  await service.deleteOne(id);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Get one schedule.
 */
export async function getOneSchedule(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  const schedule = await service.getSchedule(id);
  return res.status(HttpStatusCodes.OK).json(schedule);
}

/**
 * Add one schedule.
 */
export async function addSchedule(req: IReq<Schedule>, res: IRes) {
  const schedule = req.body;
  const { id } = req.params as { id: string };
  await service.addOneSchedule(parseInt(id), schedule);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one schedule.
 */
export async function updateOneSchedule(req: IReq<Schedule>, res: IRes) {
  const schedule = req.body;
  const id = parseInt(req.params.id);
  await service.updateOneSchedule(id, schedule);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one schedule.
 */
export async function deleteOneSchedule(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  await service.deleteOneSchedule(id);
  return res.status(HttpStatusCodes.OK).end();
}

async function currentClassroomId(req: IReq<unknown>, res: IRes): Promise<number> {
  const { classroomId } = req.params as { classroomId: string };
  if (classroomId === "@current") {
    const currentUser = res.locals.currentUser;
    return current(currentUser.id);
  }
  return parseInt(classroomId);
}
