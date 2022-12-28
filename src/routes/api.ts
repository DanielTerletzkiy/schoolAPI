import { Router } from "express";
import jetValidator from "jet-validator";
import authRoutes from "./auth-routes";
import AuthCheck, { AuthCookieCheck } from "@src/routes/middleware/AuthCheck";
import {
  Paths as UserPaths,
  basePath as UserBasePath,
} from "@src/modules/user";
import {
  Paths as ClassroomPaths,
  basePath as ClassroomBasePath,
} from "@src/modules/classroom";

import {
  Paths as AttendancePaths,
  basePath as AttendanceBasePath,
} from "@src/modules/classroom/modules/attendance";

import {
  Paths as TimetablePaths,
  basePath as TimetableBaePath,
} from "@src/modules/classroom/modules/timetable";

import { ModuleRoutePath } from "@src/routes/shared/types";
import PermissionCheck from "@src/routes/middleware/PermissionCheck";

// **** Init **** //

const apiRouter = Router({mergeParams: true}),
  validate = jetValidator();

apiRouter.use(AuthCookieCheck);

// **** Setup auth routes **** //

const authRouter = Router({mergeParams: true});

// Login user
authRouter.post(
  authRoutes.paths.login,
  validate("email", "password"),
  authRoutes.login
);

// Logout user
authRouter.get(authRoutes.paths.logout, authRoutes.logout);

// Add authRouter
apiRouter.use(authRoutes.paths.basePath, authRouter);

// **** Setup routes **** //

routeBuilder(UserBasePath, UserPaths);
routeBuilder(AttendanceBasePath, AttendancePaths);
routeBuilder(TimetableBaePath, TimetablePaths);
routeBuilder(ClassroomBasePath, ClassroomPaths);


function routeBuilder(
  basePath: string,
  paths: ModuleRoutePath,
  checkAuth = true
) {
  const router = Router({mergeParams: true});
  if (checkAuth) {
    router.use(AuthCheck);
  }

  for (const pathKey in paths) {
    const path = paths[pathKey];

    router[path.method](
      path.path,
      PermissionCheck(path.permissions),
      path.function
    );
  }

  console.log(
    `added [ ${Object.keys(paths).length} ] paths from { ${basePath} }`
  );

  apiRouter.use(basePath, router);
}

// **** Export default **** //

export default apiRouter;
