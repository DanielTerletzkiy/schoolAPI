import { User, Prisma } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
import { UserInclude } from "@src/routes/shared/PrismaInclude";

const prisma = new PrismaClient();

type UserSelect = Prisma.UserSelect;

function includeObject(): UserSelect {
  return {
    student: {
      include: {
        classroom: true,
      },
    },
    teacher: {
      include: {
        classroomTeacher: {
          include: {
            classroom: true,
            subjects: {
              include: {
                subject: true,
              },
            },
          },
        },
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    },
  };
}

/**
 * Get one user by email
 */
export async function getOneByEmail(email: string): Promise<User | null> {
  return prisma.user.findFirstOrThrow({
    where: {
      email,
    },
    include: {
      ...includeObject(),
    },
  });
}

/**
 * Get one user by id
 */
export async function getOneById(id: number): Promise<User | null> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      ...includeObject(),
      ...UserInclude(),
    },
  });
}

/**
 * See if a user with the given id exists.
 */
export async function persists(id: number): Promise<boolean> {
  return !!(await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  }));
}

/**
 * Get all users.
 */
export async function getAll(): Promise<User[]> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await prisma.user.findMany({
    select: {
      ...includeObject(),
      ...UserInclude(),
    },
  });
}

/**
 * Add one user.
 */
export async function add(user: User): Promise<User> {
  return await prisma.user.create({
    data: user,
  });
}

/**
 * Update a user.
 */
export async function updateOne(id: number, user: User): Promise<User> {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: user,
  });
}

/**
 * Delete one user.
 */
export async function deleteOne(id: number): Promise<User> {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
}
