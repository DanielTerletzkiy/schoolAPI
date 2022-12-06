import {User} from '.prisma/client';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


// **** Functions **** //

/**
 * Get one user.
 */
async function getOneByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function getOneById(id: number): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  return !!await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

/**
 * Get all users.
 */
async function getAll(): Promise<User[]> {
  return await prisma.user.findMany();
}

/**
 * Add one user.
 */
async function add(user: User): Promise<User> {
  return await prisma.user.create({
    data: user,
  });

}

/**
 * Update a user.
 */
async function update(user: User): Promise<User> {
  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: user,
  });
}

/**
 * Delete one user.
 */
async function _delete(id: number): Promise<User> {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
}


// **** Export default **** //

export default {
  getOneByEmail,
  getOneById,
  persists,
  getAll,
  add,
  update,
  delete: _delete,
} as const;
