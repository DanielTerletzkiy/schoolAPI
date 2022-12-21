-- CreateTable
CREATE TABLE "SchedulesOnClassroomTeachers" (
    "teacherId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,

    PRIMARY KEY ("teacherId", "scheduleId"),
    CONSTRAINT "SchedulesOnClassroomTeachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "ClassroomTeacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SchedulesOnClassroomTeachers_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
