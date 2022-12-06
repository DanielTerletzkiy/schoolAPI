import userRepo from '@src/repos/user-repo';
import { RouteError } from '@src/declarations/classes';
import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';
import {User} from '.prisma/client';


// **** Variables **** //

export const userNotFoundErr = 'User not found';


// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<User[]> {
  return userRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: User): Promise<User> {
  return userRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: User): Promise<User> {
  const persists = await userRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      userNotFoundErr,
    );
  }
  // Return user
  return userRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<User> {
  const persists = await userRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      userNotFoundErr,
    );
  }
  // Delete user
  return userRepo.delete(id);
}


// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
