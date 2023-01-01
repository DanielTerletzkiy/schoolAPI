import { RouteError } from "@src/declarations/classes";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { Timetable, Prisma, Schedule } from ".prisma/client";
import * as repository from "./Repository";
import ScheduleCreateInput = Prisma.ScheduleCreateInput;
import SchedulesOnClassroomTeachersCreateWithoutScheduleInput = Prisma.SchedulesOnClassroomTeachersCreateWithoutScheduleInput;
import { Day } from "@src/routes/shared/types";

// **** Variables **** //

export const timetableNotFoundErr = "timetable not found";
export const scheduleNotFoundErr = "schedule not found";

// **** Functions **** //

type TimetableCreateInput = Prisma.TimetableCreateInput;

/**
 * Get all timetables.
 */
export function getAll(
  classroomId: Timetable["classroomId"]
): Promise<Timetable[]> {
  return repository.getAll(classroomId);
}

/**
 * Get one timetable by id
 */
export function get(id: number): Promise<Timetable | null> {
  return repository.getOneById(id);
}

/**
 * Get current timetable by classroomId
 */
export async function getCurrent(
  classroomId: Timetable["classroomId"]
): Promise<Timetable | null> {
  const currentTimetableId = await repository.current(classroomId);
  const timetable = (await repository.getOneById(
    currentTimetableId
  )) as Timetable & {
    schedules: Schedule[];
    daySchedules: Schedule[][];
  };
  timetable.daySchedules = Object.values(Day)
    .filter((day) => typeof day === "string")
    .map((day) => {
      return timetable.schedules?.filter(
        (schedule) => schedule.day === Day[day as keyof typeof Day]
      );
    });
  return timetable;
}

/**
 * Add one timetable.
 */
export function addOne(
  classroomId: Timetable["classroomId"],
  timetable: Partial<Timetable>
): Promise<Timetable> {
  if (!timetable.week) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      `please provide all necessary fields`
    );
  }
  const create: TimetableCreateInput = {
    classroom: {
      connect: {
        id: classroomId,
      },
    },
    week: timetable.week,
  };
  return repository.add(create);
}

/**
 * Update one timetable.
 */
export async function updateOne(
  id: Timetable["id"],
  timetable: Omit<Partial<Timetable>, Timetable["id"]>
): Promise<Timetable> {
  const persists = await repository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, timetableNotFoundErr);
  }
  delete timetable.id;
  return repository.updateOne(id, timetable);
}

/**
 * Delete a timetable by their id.
 */
export async function deleteOne(id: number): Promise<Timetable> {
  const persists = await repository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, timetableNotFoundErr);
  }
  return repository.deleteOne(id);
}

// **** Schedules **** //

/**
 * Get one schedule by id
 */
export function getSchedule(id: number): Promise<Schedule | null> {
  return repository.getOneScheduleById(id);
}

/**
 * Add one schedule.
 */
export function addOneSchedule(
  timetableId: Schedule["timetableId"],
  schedule: Partial<Schedule & { teacherIds: Array<number> }>
): Promise<Schedule> {
  if (
    !schedule.day ||
    !schedule.subjectId ||
    !schedule.timeFrom ||
    !schedule.timeTo ||
    !schedule.teacherIds
  ) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      `please provide all necessary fields`
    );
  }

  const teachers = schedule.teacherIds.map((id) => {
    return {
      teacher: {
        connect: { id },
      },
    };
  }) as unknown as SchedulesOnClassroomTeachersCreateWithoutScheduleInput[];

  const create: ScheduleCreateInput = {
    timetable: {
      connect: {
        id: timetableId,
      },
    },
    day: schedule.day,
    subject: {
      connect: {
        id: schedule.subjectId,
      },
    },
    timeFrom: schedule.timeFrom,
    timeTo: schedule.timeTo,
    teachers: {
      create: teachers,
    },
  };
  return repository.addSchedule(create);
}

/**
 * Update one schedule.
 */
export async function updateOneSchedule(
  id: Schedule["id"],
  schedule: Omit<Partial<Schedule>, Schedule["id"]>
): Promise<Schedule> {
  const persists = await repository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, scheduleNotFoundErr);
  }
  delete schedule.id;
  return repository.updateOneSchedule(id, schedule);
}

/**
 * Delete a schedule by their id.
 */
export async function deleteOneSchedule(id: number): Promise<Schedule> {
  const persists = await repository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, scheduleNotFoundErr);
  }
  return repository.deleteOneSchedule(id);
}
