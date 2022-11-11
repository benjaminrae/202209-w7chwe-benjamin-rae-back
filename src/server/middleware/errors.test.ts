import type { Response } from "express";
import CustomError from "../../CustomError/CustomError";
import { generalError } from "./errors";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given the middleware generalError", () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it is invoked with an error with message 'Something went wrong', statusCode 404 and publicMessage 'Something went wrong' and a response", () => {
    test("Then response's method status should be invoked with 500 and json with the public message", () => {
      const errorMessage = "Something went wrong";
      const statusCode = 404;

      const error = new CustomError(errorMessage, statusCode, errorMessage);

      generalError(error, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("When it is invoked with an error with message 'There was an error'", () => {
    test("Then response's method status should be invoked with 500 and json with the message 'There was an error on the server'", () => {
      const errorMessage = "There was an error";
      const expectedErrorMessage = "There was an error on the server";
      const statusCode = 500;

      const error = new Error(errorMessage);

      generalError(error as CustomError, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: expectedErrorMessage });
    });
  });
});
