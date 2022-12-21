/*
  Warnings:

  - Made the column `mainTeacherId` on table `Classroom` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classroom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prefix" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "suffix" TEXT NOT NULL,
    "mainTeacherId" INTEGER NOT NULL,
    CONSTRAINT "Classroom_mainTeacherId_fkey" FOREIGN KEY ("mainTeacherId") REFERENCES "ClassroomTeacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Classroom" ("grade", "id", "mainTeacherId", "prefix", "suffix") SELECT "grade", "id", "mainTeacherId", "prefix", "suffix" FROM "Classroom";
DROP TABLE "Classroom";
ALTER TABLE "new_Classroom" RENAME TO "Classroom";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
