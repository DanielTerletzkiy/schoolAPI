import { Classroom, Prisma } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
import { UserInclude } from "@src/routes/shared/PrismaInclude";

const prisma = new PrismaClient();

type ClassroomInclude = Prisma.ClassroomInclude;
type TimetableInclude = Prisma.TimetableInclude;

function includeObject(): ClassroomInclude {
  return {
    students: {
      include: {
        user: { select: UserInclude() },
      },
    },
    teachers: {
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
        teacher: {
          include: {
            user: { select: UserInclude() },
          },
        },
      },
    },
  };
}

function getTimetableInclude(): TimetableInclude {
  return {
    schedules: {
      include: {
        subject: {
          include: {
            teachers: {
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
 * Get one classroom by id
 */
export async function getOneById(id: number): Promise<Classroom | null> {
  return await prisma.classroom.findUnique({
    where: {
      id,
    },
    include: {
      ...includeObject(),
      timetables: {
        include: {
          ...getTimetableInclude(),
        },
      },
    },
  });
}

/**
 * Get one classroom by id
 */
export async function getOneByUserId(
  userId: number
): Promise<Classroom | null> {
  return await prisma.classroom.findFirst({
    where: {
      students: {
        every: {
          userId,
        },
      },
    },
    include: {
      ...includeObject(),
    },
  });
}

/**
 * See if a classroom with the given id exists.
 */
export async function persists(id: number): Promise<boolean> {
  return !!(await prisma.classroom.findUnique({
    where: {
      id,
    },
  }));
}

/**
 * Get all classrooms.
 */
export async function getAll(): Promise<Classroom[]> {
  return await prisma.classroom.findMany({
    include: {
      ...includeObject(),
    },
  });
}

/**
 * Add one classroom.
 */
export async function add(classroom: Classroom): Promise<Classroom> {
  return await prisma.classroom.create({
    data: classroom,
  });
}

/**
 * Update a classroom.
 */
export async function updateOne(
  id: number,
  classroom: Classroom
): Promise<Classroom> {
  return await prisma.classroom.update({
    where: {
      id: id,
    },
    data: classroom,
  });
}

/**
 * Delete one classroom.
 */
export async function deleteOne(id: number): Promise<Classroom> {
  return await prisma.classroom.delete({
    where: {
      id,
    },
  });
}

/**
 * Assign student to a classroom.
 */
export async function assignStudent(
  id: number,
  userId: number
): Promise<Classroom> {
  return await prisma.classroom.update({
    where: {
      id: id,
    },
    data: {
      students: {
        connect: {
          userId,
        },
      },
    },
  });
}

/**
 * Remove student to a classroom.
 */
export async function removeStudent(
  id: number,
  userId: number
): Promise<Classroom> {
  return await prisma.classroom.update({
    where: {
      id: id,
    },
    data: {
      students: {
        connect: {
          userId,
        },
      },
    },
  });
}
