import { Router } from "express";
import { validate } from "express-validation";
import {
  loginUser,
  registerUser,
} from "../controllers/usersControllers/usersControllers.js";
import loginUserSchema from "../schemas/loginUserSchema.js";
import registerUserSchema from "../schemas/registerUserSchema.js";
import routes from "./routes.js";

const { registerRoute, loginRoute } = routes;

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.post(
  registerRoute,
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);

usersRouter.post(
  loginRoute,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
