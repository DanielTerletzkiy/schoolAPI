/*
  Warnings:

  - Added the required column `timeFrom` to the `TimetableItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTo` to the `TimetableItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimetableItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subjectId" INTEGER NOT NULL,
    "timetableId" INTEGER NOT NULL,
    "timeFrom" INTEGER NOT NULL,
    "timeTo" INTEGER NOT NULL,
    CONSTRAINT "TimetableItem_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimetableItem_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimetableItem" ("id", "subjectId", "timetableId") SELECT "id", "subjectId", "timetableId" FROM "TimetableItem";
DROP TABLE "TimetableItem";
ALTER TABLE "new_TimetableItem" RENAME TO "TimetableItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
