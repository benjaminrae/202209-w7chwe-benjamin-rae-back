import type { NextFunction, Request, Response } from "express";
import { registerUserErrors } from "../../CustomError/errors";
import type { RegisterUserBody } from "./types";
import { registerUser } from "./usersControllers";

const req: Partial<Request> = {};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a registerUser controller", () => {
  describe("When it receives a request with username 'postman', email 'postman@correos.es', password: lettersandparcels, confirmPassword: packages", () => {
    test("Then next should be called with an error with message 'Passwords don't match'", async () => {
      const body: RegisterUserBody = {
        username: "postman",
        email: "postman@correos.es",
        password: "lettersandparcels",
        confirmPassword: "packages",
      };
      req.body = body;

      await registerUser(req as Request, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(registerUserErrors.noPasswordMatch);
    });
  });
});
