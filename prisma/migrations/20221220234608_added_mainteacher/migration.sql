-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classroom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prefix" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "suffix" TEXT NOT NULL,
    "mainTeacherId" INTEGER,
    CONSTRAINT "Classroom_mainTeacherId_fkey" FOREIGN KEY ("mainTeacherId") REFERENCES "ClassroomTeacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Classroom" ("grade", "id", "prefix", "suffix") SELECT "grade", "id", "prefix", "suffix" FROM "Classroom";
DROP TABLE "Classroom";
ALTER TABLE "new_Classroom" RENAME TO "Classroom";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
