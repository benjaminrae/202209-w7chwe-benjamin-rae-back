import cors from "cors";
import express from "express";
import morgan from "morgan";
import { generalError, unknownEndpoint } from "./middleware/errors/errors.js";
import routes from "./routers/routes.js";
import usersRouter from "./routers/usersRouter.js";

const { usersRoute } = routes;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.disable("x-powered-by");

app.use(usersRoute, usersRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
