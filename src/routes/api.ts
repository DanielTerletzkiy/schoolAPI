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

import { ModuleRoutePath } from "@src/routes/shared/types";
import PermissionCheck from "@src/routes/middleware/PermissionCheck";
import moment from "moment";

// **** Init **** //

const apiRouter = Router(),
  validate = jetValidator();

apiRouter.use(AuthCookieCheck);

// **** Setup auth routes **** //

const authRouter = Router();

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
routeBuilder(ClassroomBasePath, ClassroomPaths);


function routeBuilder(
  basePath: string,
  paths: ModuleRoutePath,
  checkAuth = true
) {
  const router = Router();
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
