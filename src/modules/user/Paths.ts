import {HTTP, ModuleRoutePath, UserRole} from "@src/routes/shared/types";
import * as controller from "./Controller";

export const basePath = "/user";

export default {
  add: {
    method: HTTP.POST,
    path: "/",
    permissions: [UserRole.Admin, UserRole.Teacher],
    function: controller.add,
  },
  getAll: {
    method: HTTP.GET,
    path: "/",
    permissions: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
    function: controller.getAll,
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
    permissions: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
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
} as ModuleRoutePath;
