import 'express';
import {SessionUser} from "@src/routes/shared/adminMw";


// **** Declaration Merging **** //

declare module 'express' {

  export interface Request {
    signedCookies: Record<string, string>;
  }
}
