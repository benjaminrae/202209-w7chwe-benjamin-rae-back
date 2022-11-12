import { Router } from "express";
import { validate } from "express-validation";
import { registerUser } from "../controllers/usersControllers.js";
import registerUserSchema from "../schemas/registerUserSchema.js";
import routes from "./routes.js";

const { registerRoute } = routes;

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.post(
  registerRoute,
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);

export default usersRouter;
