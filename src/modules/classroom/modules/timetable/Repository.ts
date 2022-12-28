import { Timetable, Prisma, Schedule } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
import { UserInclude } from "@src/routes/shared/PrismaInclude";
import moment from "moment";

const prisma = new PrismaClient();

type TimetableWhereInput = Prisma.TimetableWhereInput;
type TimetableInclude = Prisma.TimetableInclude;
type TimetableCreateInput = Prisma.TimetableCreateInput;

type ScheduleCreateInput = Prisma.ScheduleCreateInput;

export function includeObject(): TimetableInclude {
  return {
    schedules: {
      include: {
        subject: true,
        teachers: {
          include: {
            teacher: {
              include: {
                teacher: {
                  include: {
                    user: { select: UserInclude() },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

/**
 * Get one Timetable by id
 */
export async function getOneById(id: number): Promise<Timetable | null> {
  return prisma.timetable.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      ...includeObject(),
    },
  });
}

/**
 * Get all Timetables
 */
export async function getAll(
  classroomId: Timetable["classroomId"]
): Promise<Timetable[]> {
  return prisma.timetable.findMany({
    where: { classroomId },
    include: {
      ...includeObject(),
    },
  });
}

/**
 * See if a Timetable with the given id exists.
 */
export async function persists(id: number): Promise<boolean> {
  return !!(await prisma.timetable.findFirstOrThrow({
    where: {
      id,
    },
  }));
}

/**
 * Get currently used timetable id.
 */
export async function current(
  classroomId: Timetable["classroomId"]
): Promise<Timetable["classroomId"]> {
  const { id } = await prisma.timetable.findFirstOrThrow({
    where: {
      classroomId,
      OR: [
        {
          week: moment().isoWeek(),
          year: moment().year(),
        },
        {
          //default year timetable
          week: 0,
          year: moment().year(),
        },
        {
          //default week timetable
          week: moment().isoWeek(),
          year: 0,
        },
        {
          //default timetable
          week: 0,
          year: 0,
        },
      ],
    },
    select: {
      id: true,
    },
  });
  return id;
}

/**
 * Add one Timetable.
 */
export async function add(timetable: TimetableCreateInput): Promise<Timetable> {
  return prisma.timetable.create({
    data: timetable,
  });
}

/**
 * Update a Timetable.
 */
export async function updateOne(
  id: Timetable["id"],
  timetable: Omit<Partial<Timetable>, Timetable["id"]>
): Promise<Timetable> {
  return prisma.timetable.update({
    where: {
      id: id,
    },
    data: timetable,
  });
}

/**
 * Delete one Timetable.
 */
export async function deleteOne(id: number): Promise<Timetable> {
  return prisma.timetable.delete({
    where: {
      id,
    },
  });
}

/**
 * Add one Timetable schedule.
 */
export async function addSchedule(
  schedule: ScheduleCreateInput
): Promise<Schedule> {
  return prisma.schedule.create({
    data: schedule,
  });
}

/**
 * Get one Timetable schedule by id
 */
export async function getOneScheduleById(id: number): Promise<Schedule | null> {
  return prisma.schedule.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      teachers: {
        include: {
          teacher: {
            include: {
              teacher: {
                include: {
                  user: { select: UserInclude() },
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Update a Timetable schedule.
 */
export async function updateOneSchedule(
  id: Schedule["id"],
  schedule: Omit<Partial<Schedule>, Schedule["id"]>
): Promise<Schedule> {
  return prisma.schedule.update({
    where: {
      id: id,
    },
    data: schedule,
  });
}

/**
 * Delete one Timetable schedule.
 */
export async function deleteOneSchedule(id: number): Promise<Schedule> {
  return prisma.schedule.delete({
    where: {
      id,
    },
  });
}
