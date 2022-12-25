import { RouteError } from "@src/declarations/classes";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { Attendance, Excuse, Prisma } from ".prisma/client";
import * as repository from "./Repository";
import moment, { unitOfTime } from "moment";
import { AttendanceGetter, AttendanceRange } from "./Repository";
import StartOf = moment.unitOfTime.StartOf;

// **** Variables **** //

export const attendanceNotFoundErr = "attendance not found";

// **** Functions **** //

type AttendanceCreateInput = Prisma.AttendanceCreateInput;

/**
 * Get all attendances.
 */
export function getAll(
  range: StartOf,
  index: string,
  getter?: AttendanceGetter,
  getterId?: number
): Promise<Attendance[]> {
  return repository.getAll(getMultiRangeData(range, index), getter, getterId);
}

/**
 * Get one attendance by id
 */
export function get(id: number): Promise<Attendance | null> {
  return repository.getOneById(id);
}

/**
 * Add one attendance.
 */
export function addOne(
  attendance: Partial<Attendance & Excuse>
): Promise<Attendance> {
  if (
    !attendance.scheduleId ||
    !attendance.studentId ||
    !attendance.classroomId ||
    !attendance.teacherId
  ) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      `please provide all necessary fields`
    );
  }
  const create: AttendanceCreateInput = {
    teacher: {
      connect: {
        id: attendance.teacherId,
      },
    },
    schedule: {
      connect: {
        id: attendance.scheduleId,
      },
    },
    student: {
      connect: {
        id: attendance.studentId,
      },
    },
    classroom: {
      connect: {
        id: attendance.classroomId,
      },
    },
  };
  if (attendance.reason && attendance.document) {
    create.excuse = {
      create: {
        reason: attendance.reason,
        document: attendance.document,
      },
    };
  }
  return repository.add(create);
}

/**
 * Update one attendance.
 */
export async function updateOne(
  id: number,
  attendance: Attendance
): Promise<Attendance> {
  const persists = await repository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, attendanceNotFoundErr);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete attendance.id;
  // Return attendance
  return repository.updateOne(id, attendance);
}

/**
 * Delete a attendance by their id.
 */
export async function deleteOne(id: number): Promise<Attendance> {
  const persists = await repository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, attendanceNotFoundErr);
  }
  // Delete attendance
  return repository.deleteOne(id);
}

function getMultiRangeData(
  rangeType: unitOfTime.StartOf,
  index: string
): AttendanceRange {
  let startRange: Date = moment().startOf("date").toDate();
  let endRange: Date = moment().endOf("date").toDate();
  if (index) {
    switch (rangeType) {
      case "date": {
        startRange = moment(index).startOf(rangeType).toDate();
        endRange = moment(index).endOf(rangeType).toDate();
        break;
      }
      case "day": {
        startRange = moment().day(index).startOf(rangeType).toDate();
        endRange = moment().day(index).endOf(rangeType).toDate();
        break;
      }
      case "week": {
        startRange = moment().week(parseInt(index)).startOf(rangeType).toDate();
        endRange = moment().week(parseInt(index)).endOf(rangeType).toDate();
        break;
      }
      case "month": {
        startRange = moment().month(index).startOf(rangeType).toDate();
        endRange = moment().month(index).endOf(rangeType).toDate();
        break;
      }
      case "quarter": {
        startRange = moment()
          .quarter(parseInt(index))
          .startOf(rangeType)
          .toDate();
        endRange = moment().quarter(parseInt(index)).endOf(rangeType).toDate();
        break;
      }
      default: {
        throw new RouteError(
          HttpStatusCodes.BAD_REQUEST,
          `range not supported: ${String(rangeType)}`
        );
      }
    }
  }

  return { from: startRange, to: endRange };
}
