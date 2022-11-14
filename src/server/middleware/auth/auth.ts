import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../../controllers/profilesControllers/types";
import type { UserTokenPayload } from "../../controllers/usersControllers/types";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import environment from "../../../loadEnvironment.js";
import { authErrors } from "../../../CustomError/errors.js";

const { jwtSecret } = environment;

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      next(authErrors.noTokenProvided);
    }

    if (!authHeader.startsWith("Bearer")) {
      next(authErrors.missingBearer);
    }

    const token = authHeader.replace(/^Bearer\s*/, "");

    const user: UserTokenPayload = jwt.verify(
      token,
      jwtSecret
    ) as UserTokenPayload;

    req.userId = user.id;

    next();
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 401, "Invalid token"));
  }
};

export default auth;
