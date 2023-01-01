import { RouteError } from "@src/declarations/classes";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { UserRole } from "@src/routes/shared/types";
import { Classroom } from ".prisma/client";
import * as repository from "./Repository";
import { SessionUser } from "@src/routes/shared/adminMw";

// **** Variables **** //

export const classroomNotFoundErr = "classroom not found";

// **** Functions **** //

/**
 * Get all classrooms.
 */
export function getAll(): Promise<Classroom[]> {
  return repository.getAll();
}

/**
 * Get one classroom by id
 */
export function get(
  currentUser: SessionUser,
  id = 0
): Promise<Classroom | null> {
  switch (currentUser.roleId) {
    case UserRole.Student: {
      return repository.getOneByUserId(currentUser.id);
    }
    default: {
      return repository.getOneById(id);
    }
  }
}

/**
 * Add one classroom.
 */
export function addOne(classroom: Classroom): Promise<Classroom> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete classroom.id;
  return repository.add(classroom);
}

/**
 * Update one classroom.
 */
export async function updateOne(
  id: number,
  classroom: Classroom
): Promise<Classroom> {
  const persists = await repository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, classroomNotFoundErr);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete classroom.id;
  // Return classroom
  return repository.updateOne(id, classroom);
}

/**
 * Delete a classroom by their id.
 */
export async function deleteOne(id: number): Promise<Classroom> {
  const persists = await repository.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, classroomNotFoundErr);
  }
  // Delete classroom
  return repository.deleteOne(id);
}
