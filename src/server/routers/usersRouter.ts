import { Router } from "express";
import { validate } from "express-validation";
import { loginUser, registerUser } from "../controllers/usersControllers.js";
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

usersRouter.post(loginRoute, loginUser);

export default usersRouter;
