import environment from "../../loadEnvironment.js";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { registerUserErrors } from "../../CustomError/errors.js";
import type { RegisterUserBody } from "./types";
import User from "../../database/models/User.js";

const { saltLength } = environment;

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    RegisterUserBody
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    next(registerUserErrors.noPasswordMatch);
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltLength);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({
        user: {
          username: newUser.username,
          email: newUser.email,
          id: newUser._id.toString(),
        },
      });
  } catch (error: unknown) {
    if ((error as Error).message.includes("duplicate key")) {
      next(registerUserErrors.alreadyRegistered);
      return;
    }

    next(error);
  }
};
