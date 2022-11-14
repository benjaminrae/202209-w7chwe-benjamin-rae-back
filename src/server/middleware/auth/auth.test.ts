import type { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { authErrors } from "../../../CustomError/errors";
import auth from "./auth";
import type { CustomRequest } from "../../controllers/profilesControllers/types";

const req: Partial<Request> = {};

const next = jest.fn();

describe("Given the auth middleware", () => {
  describe("When it receives a request with no Authorization header and a next function", () => {
    test("Then it should invoke next with an error with status code 401 and public message 'No token provided'", () => {
      const expectedError = authErrors.noTokenProvided;

      req.header = jest.fn().mockReturnValueOnce(undefined);

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with Authorization header '1234'", () => {
    test("Then it should invoke next with an error with status code 401 and public message 'Bad Token'", () => {
      const expectedError = authErrors.missingBearer;

      req.header = jest.fn().mockReturnValueOnce("1234");

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with Authorization header 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI2MzZjMGY4MmM4ZTcxM2IwMmQ3NjZiOGYiLCJpYXQiOjE2NjgwMzY3NzQsImV4cCI6MTY2ODIwOTU3NH0.RF-F_4pQ0NpthI3kSVyZMxHcEqiCPcyao7Gyzdbc_9M'", () => {
    test("Then it should add the userId property with the token to the request and call next", () => {
      req.header = jest
        .fn()
        .mockReturnValueOnce(
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI2MzZjMGY4MmM4ZTcxM2IwMmQ3NjZiOGYiLCJpYXQiOjE2NjgwMzY3NzQsImV4cCI6MTY2ODIwOTU3NH0.RF-F_4pQ0NpthI3kSVyZMxHcEqiCPcyao7Gyzdbc_9M"
        );
      const userId = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValueOnce({ id: userId });

      auth(req as CustomRequest, null, next as NextFunction);

      expect(req).toHaveProperty("userId", userId);
      expect(next).toHaveBeenCalled();
    });
  });
});
