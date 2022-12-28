import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { IReq, IRes } from "@src/routes/shared/types";
import { Attendance } from ".prisma/client";
import * as service from "./Service";
import moment from "moment/moment";
import StartOf = moment.unitOfTime.StartOf;
import { AttendanceGetter } from "@src/modules/classroom/modules/attendance/Repository";

/**
 * Get all attendances.
 */
export async function getAll(req: IReq, res: IRes) {
  const { range, index, getter, getterId } = req.params as {
    range: StartOf;
    index: string;
    getter: AttendanceGetter;
    getterId: string;
  };
  const attendances = await service.getAll(
    range,
    index,
    getter,
    parseInt(getterId)
  );
  return res.status(HttpStatusCodes.OK).json(attendances);
}

export async function getOne(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  const attendance = await service.get(id);
  return res.status(HttpStatusCodes.OK).json(attendance);
}

/**
 * Add one attendance.
 */
export async function add(req: IReq<Attendance>, res: IRes) {
  const attendance = req.body;
  await service.addOne(attendance);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one attendance.
 */
export async function updateOne(req: IReq<Attendance>, res: IRes) {
  const attendance = req.body;
  const id = parseInt(req.params.id);
  await service.updateOne(id, attendance);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one attendance.
 */
export async function deleteOne(req: IReq, res: IRes) {
  const id = parseInt(req.params.id);
  await service.deleteOne(id);
  return res.status(HttpStatusCodes.OK).end();
}
