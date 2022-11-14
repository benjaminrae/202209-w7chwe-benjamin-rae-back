import type { Request } from "express";
import type * as core from "express-serve-static-core";
import type { UserStructure } from "../usersControllers/types";

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  userId: string;
}

export interface EditProfileRequestBody {
  profile: Partial<UserStructure>;
}
