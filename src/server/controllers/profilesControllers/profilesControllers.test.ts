import { jsxNamespacedName } from "@babel/types";
import type { NextFunction, Response } from "express";
import User from "../../../database/models/User";
import {
  getRandomUser,
  getRandomUserList,
} from "../../../factories/usersFactory";
import { editProfile, getProfiles } from "./profilesControllers";
import type { CustomRequest } from "./types";

afterEach(() => {
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

  describe("When it receives a request and User.find rejects", () => {
    test("Then next should be invoked with an error", async () => {
      const error = new Error();

      User.find = jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockRejectedValue(error) }),
      });

      await getProfiles(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given an editProfile controller", () => {
  const user = getRandomUser();

  describe("When it receives an authorized request with a new email 'newEmail@feisbuk.com' in the body", () => {
    test("Then it should invoke response's method status with 201 and json with the user and the updated email", async () => {
      const profile = {
        ...user,
        email: "newEmail@feisbuk.com",
      };
      req.body = profile;
      const expectedStatus = 201;

      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockReturnValue(profile) }),
      });

      await editProfile(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ profile });
    });
  });

  describe("When it receives a request with a new email but User.findByIdAndUpdate rejects", () => {
    test("Then next should be called with an error", async () => {
      const profile = {
        ...user,
        email: "newEmail@feisbuk.com",
      };
      req.body = profile;
      const error = new Error();

      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockRejectedValue(error) }),
      });

      await editProfile(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
