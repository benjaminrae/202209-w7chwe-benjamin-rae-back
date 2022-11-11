import CustomError from "./CustomError";

describe("Given the class CustomError", () => {
  describe("When instantiated with message 'Unknown endpoint', statusCode 404 and publicMessage 'Unknown endpoint'", () => {
    test("Then it should return an object with those properties and values", () => {
      const expectedError = {
        message: "Unknown endpoint",
        statusCode: 404,
        publicMessage: "Unknown endpoint",
      };

      const customError = new CustomError(
        expectedError.message,
        expectedError.statusCode,
        expectedError.publicMessage
      );

      expect(customError).toHaveProperty("message", expectedError.message);
      expect(customError).toHaveProperty(
        "statusCode",
        expectedError.statusCode
      );
      expect(customError).toHaveProperty(
        "publicMessage",
        expectedError.publicMessage
      );
    });
  });
});
