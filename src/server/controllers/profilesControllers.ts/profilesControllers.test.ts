import exp from "constants";
import type { NextFunction, Response } from "express";
import User from "../../../database/models/User";
import { getRandomUserList } from "../../../factories/usersFactory";
import { getProfiles } from "./profilesControllers";
import type { CustomRequest } from "./types";

beforeAll(() => {
  jest.clearAllMocks();
});

const req: Partial<CustomRequest> = {
  userId: "1234",
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const profileList = getRandomUserList(3);

describe("Given a getProfiles controller", () => {
  describe("When it receives a custom request with id '1234' and response", () => {
    test("Then it should invoke response's method status with 200 and json with a list of profiles", async () => {
      const expectedStatus = 200;

      User.find = jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockReturnValue(profileList) }),
      });

      await getProfiles(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ profiles: profileList });
    });
  });
});
