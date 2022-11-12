import CustomError from "./CustomError.js";

export const registerUserErrors = {
  noPasswordMatch: new CustomError(
    "Passwords don't match",
    400,
    "Your passwords must match"
  ),

  alreadyRegistered: new CustomError(
    "User is already registered",
    409,
    "User is already registered"
  ),
};
