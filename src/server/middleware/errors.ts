import chalk from "chalk";
import debugConfig from "debug";
import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import type CustomError from "../../CustomError/CustomError";

const debug = debugConfig("feisbuk:server:middleware:errors");

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    const validationErrors = (error as ValidationError).details.body.map(
      (error) => error.message
    );

    debug(chalk.red(validationErrors.join("\n")));

    error.publicMessage =
      "The details you provided don't meet the requirements: " +
      validationErrors.join(", ");

    error.statusCode = 400;
  }

  const { message, statusCode, publicMessage } = error;

  debug(chalk.red(message));

  const responseMessage = publicMessage || "There was an error on the server";
  const responseStatus = statusCode ?? 500;

  res.status(responseStatus).json({ error: responseMessage });
};

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({ message: "Unknown Endpoint" });
};
