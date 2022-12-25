import {Prisma} from ".prisma/client";

type UserSelect = Prisma.UserSelect;

export function UserInclude(): UserSelect {
  return {
    hash: false,
    id: true,
    email: true,
    name: true,
    surname: true,
    roleId: true,
    role: true,
    student: true,
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
