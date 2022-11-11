import chalk from "chalk";
import debugConfig from "debug";
import type { NextFunction, Request, Response } from "express";
import type CustomError from "../../CustomError/CustomError";

const debug = debugConfig("feisbuk:server:middleware:errors");

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  const { message, statusCode, publicMessage } = error;

  debug(chalk.red(message));

  const responseMessage = publicMessage || "There was an error on the server";
  const responseStatus = statusCode ?? 500;

  res.status(responseStatus).json({ error: responseMessage });
};

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({ message: "Unknown Endpoint" });
};
