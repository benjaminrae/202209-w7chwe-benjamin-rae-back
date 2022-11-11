import chalk from "chalk";
import debug from "debug";
import type { NextFunction, Request, Response } from "express";
import type CustomError from "../../CustomError/CustomError";

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
