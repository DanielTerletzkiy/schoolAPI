import { Attendance, Prisma } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
import { UserInclude } from "@src/routes/shared/PrismaInclude";

const prisma = new PrismaClient();

export type AttendanceRange = {
  from: Date;
  to: Date;
};

export enum AttendanceGetter {
  User= 'user',
  Schedule = 'schedule',
}

type AttendanceWhereInput = Prisma.AttendanceWhereInput;
type AttendanceInclude = Prisma.AttendanceInclude;
type AttendanceCreateInput = Prisma.AttendanceCreateInput;

function includeObject(): AttendanceInclude {
  return {
    student: {
      include: {
        user: { select: UserInclude() },
      },
    },
    excuse: true,
    teacher: {
      include: {
        user: { select: UserInclude() },
      },
    },
    schedule: {
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
    },
  };
}

/**
 * Get one Attendance by id
 */
export async function getOneById(id: number): Promise<Attendance | null> {
  return prisma.attendance.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      ...includeObject(),
    },
  });
}

/**
 * Get one Attendance for duration type, by user or schedule id
 */
export async function getAll(
  range: AttendanceRange,
  getter?: AttendanceGetter,
  getterId?: number
): Promise<Attendance[]> {
  const where: AttendanceWhereInput = {
    created: {
      gt: range.from,
      lt: range.to,
    },
  };
  switch (getter) {
    case AttendanceGetter.User: {
      where.studentId = getterId;
      break;
    }
    case AttendanceGetter.Schedule: {
      where.scheduleId = getterId;
      break;
    }
  }
  return prisma.attendance.findMany({
    where,
    include: {
      ...includeObject(),
    },
  });
}

/**
 * See if an Attendance with the given id exists.
 */
export async function persists(id: number): Promise<boolean> {
  return !!(await prisma.attendance.findFirstOrThrow({
    where: {
      id,
    },
  }));
}

/**
 * Add one Attendance.
 */
export async function add(attendance: AttendanceCreateInput): Promise<Attendance> {
  return prisma.attendance.create({
    data: attendance,
  });
}

/**
 * Update a Attendance.
 */
export async function updateOne(
  id: number,
  attendance: Attendance
): Promise<Attendance> {
  return prisma.attendance.update({
    where: {
      id: id,
    },
    data: attendance,
  });
}

/**
 * Delete one Attendance.
 */
export async function deleteOne(id: number): Promise<Attendance> {
  return prisma.attendance.delete({
    where: {
      id,
    },
  });
}
