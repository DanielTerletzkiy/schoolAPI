import { RouteError } from "@src/declarations/classes";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { User } from ".prisma/client";
import * as userRepository from "./Repository";

// **** Variables **** //

export const userNotFoundErr = "User not found";

// **** Functions **** //

/**
 * Get all users.
 */
export function getAll(): Promise<User[]> {
  return userRepository.getAll();
}

/**
 * Get one user by id
 */
export function get(id: number): Promise<User | null> {
  return userRepository.getOneById(id);
}

/**
 * Add one user.
 */
export function addOne(user: User): Promise<User> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete user.id;
  return userRepository.add(user);
}

/**
 * Update one user.
 */
export async function updateOne(id: number, user: User): Promise<User> {
  const persists = await userRepository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, userNotFoundErr);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete user.id;
  // Return user
  return userRepository.updateOne(id, user);
}

/**
 * Delete a user by their id.
 */
export async function deleteOne(id: number): Promise<User> {
  const persists = await userRepository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, userNotFoundErr);
  }
  // Delete user
  return userRepository.deleteOne(id);
}
