import cors from "cors";
import express from "express";
import morgan from "morgan";
import auth from "./middleware/auth/auth.js";
import { generalError, unknownEndpoint } from "./middleware/errors/errors.js";
import profilesRouter from "./routers/profilesRouter/profilesRouter.js";
import routes from "./routers/routes.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";

const { usersRoute, profilesRoute } = routes;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.disable("x-powered-by");

app.use(usersRoute, usersRouter);
app.use(profilesRoute, auth, profilesRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
