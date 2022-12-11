import {
  HTTP,
  ModuleRoutePath,
  UserRole,
} from "@src/routes/shared/types";
import * as controller from "./Controller";

export const basePath = "/classroom";
export default {
  add: {
    method: HTTP.POST,
    path: "/",
    permissions: [UserRole.Admin],
    function: controller.add,
  },
  getAll: {
    method: HTTP.GET,
    path: "/",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.getAll,
  },
  getOne: {
    method: HTTP.GET,
    path: "/:id",
    permissions: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
    function: controller.getOne,
  },
  updateOne: {
    method: HTTP.PATCH,
    path: "/:id",
    permissions: [UserRole.Admin],
    function: controller.updateOne,
  },
  deleteOne: {
    method: HTTP.DELETE,
    path: "/:id",
    permissions: [UserRole.Admin],
    function: controller.deleteOne,
  },
  //TODO
  /*assignStudent: {
  method: HTTP.PATCH,
  path: "/:id/student/:studentId",
  permissions: [UserRole.Admin],
},
removeStudent: {
  method: HTTP.DELETE,
  path: "/:id/student/:studentId",
  permissions: [UserRole.Admin],
},
assignTeacher: {
  method: HTTP.PATCH,
  path: "/:id/teacher/:teacherId",
  permissions: [UserRole.Admin],
},
removeTeacher: {
  method: HTTP.DELETE,
  path: "/:id/teacher/:teacherId",
  permissions: [UserRole.Admin],
},*/
} as ModuleRoutePath;
