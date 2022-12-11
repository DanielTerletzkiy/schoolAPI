import { Router } from "express";
import jetValidator from "jet-validator";
import authRoutes from "./auth-routes";
import AuthCheck, { AuthCookieCheck } from "@src/routes/middleware/AuthCheck";
import { Paths as UserPaths, basePath as UserBasePath } from "@src/modules/user";
import {
  Paths as ClassroomPaths,
  basePath as ClassroomBasePath,
} from "@src/modules/classroom";

import { ModuleRoutePath } from "@src/routes/shared/types";
import PermissionCheck from "@src/routes/middleware/PermissionCheck";

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

// **** Setup user routes **** //

// Add userRouter
apiRouter.use(UserBasePath, routeBuilder(UserPaths));
apiRouter.use(ClassroomBasePath, routeBuilder(ClassroomPaths));

function routeBuilder(paths: ModuleRoutePath, checkAuth = true) {
  const router = Router();
  if (checkAuth) {
    router.use(AuthCheck);
  }

  for (const pathsKey in paths) {
    const path = paths[pathsKey];

    router[path.method](
      path.path,
      PermissionCheck(path.permissions),
      path.function
    );
  }

  return router;
}

// **** Export default **** //

export default apiRouter;
