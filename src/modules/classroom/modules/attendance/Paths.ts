import { HTTP, ModuleRoutePath, UserRole } from "@src/routes/shared/types";
import * as controller from "./Controller";
import { basePath as parentPath } from "../../index";

export const basePath = parentPath + "/:classroomId/attendance";
export default {
  add: {
    method: HTTP.POST,
    path: "/",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.add,
  },
  getOne: {
    method: HTTP.GET,
    path: "/:id",
    permissions: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
    function: controller.getOne,
  },
  getDate: {
    method: HTTP.GET,
    path: "/range/:range/:index?",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.getAll,
  },
  getDateGetter: {
    method: HTTP.GET,
    path: "/range/:range/:index/:getter/:getterId",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.getAll,
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
} as ModuleRoutePath;
