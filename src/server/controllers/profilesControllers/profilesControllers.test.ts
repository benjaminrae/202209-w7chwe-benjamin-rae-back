import type { NextFunction, Response } from "express";
import User from "../../../database/models/User";
import {
  getRandomUser,
  getRandomUserList,
} from "../../../factories/usersFactory";
import type { UserWithIdStructure } from "../usersControllers/types";
import {
  editProfile,
  getProfileById,
  getProfiles,
} from "./profilesControllers";
import type { CustomRequest } from "./types";

afterEach(() => {
  jest.clearAllMocks();
});

const req: Partial<CustomRequest> = {
  userId: "1234",
  params: {},
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
        image: "",
      };
      req.body = profile;
      const expectedStatus = 201;

      User.findByIdAndUpdate = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            toJSON: jest.fn().mockReturnValue(profile),
          }),
        }),
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

describe("Given a getProfileById controller", () => {
  const user = getRandomUser() as UserWithIdStructure;

  describe(`When it receives a request with the id ${user._id}`, () => {
    test("Then it should invoke response's status method with 200 and json with the user's profile", async () => {
      const params = {
        profileId: user._id,
      };
      req.params = params;
      const expectedStatus = 200;

      User.findById = jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockReturnValue(user) }),
      });

      await getProfileById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ profile: user });
    });
  });

  describe("When it receives a request and User.findById rejects", () => {
    test("Then it should call next with an error", async () => {
      const params = {
        profileId: user._id,
      };
      req.params = params;
      const error = new Error();

      User.findById = jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockRejectedValue(error) }),
      });

      await getProfileById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a user id that is not on the database", () => {
    test("Then it should call next with an error with message 'Profile not found'", async () => {
      const params = {
        profileId: user._id,
      };
      req.params = params;
      const error = new Error("Profile not found");

      User.findById = jest.fn().mockReturnValue({
        select: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockReturnValue(null) }),
      });

      await getProfileById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
