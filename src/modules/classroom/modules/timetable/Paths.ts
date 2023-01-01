import { HTTP, ModuleRoutePath, UserRole } from "@src/routes/shared/types";
import * as controller from "./Controller";
import { basePath as parentPath } from "../../index";

export const basePath = parentPath + "/:classroomId/timetable";
export default {
  add: {
    method: HTTP.POST,
    path: "/",
    permissions: [UserRole.Admin],
    function: controller.add,
  },
  getCurrent: {
    method: HTTP.GET,
    path: "/@current",
    permissions: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
    function: controller.getCurrent,
  },
  getOne: {
    method: HTTP.GET,
    path: "/:id",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.getOne,
  },
  updateOne: {
    method: HTTP.PATCH,
    path: "/:id",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.updateOne,
  },
  deleteOne: {
    method: HTTP.DELETE,
    path: "/:id",
    permissions: [UserRole.Admin],
    function: controller.deleteOne,
  },

  // **** Schedules **** //

  addSchedule: {
    method: HTTP.POST,
    path: "/:id/schedule",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.addSchedule,
  },
  getOneSchedule: {
    method: HTTP.GET,
    path: "/schedule/:id",
    permissions: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
    function: controller.getOneSchedule,
  },
  updateOneSchedule: {
    method: HTTP.PATCH,
    path: "/schedule/:id",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.updateOneSchedule,
  },
  deleteOneSchedule: {
    method: HTTP.DELETE,
    path: "/schedule/:id",
    permissions: [UserRole.Admin],
    function: controller.deleteOneSchedule,
  },
} as ModuleRoutePath;
