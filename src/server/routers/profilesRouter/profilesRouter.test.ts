import fs from "fs/promises";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectDb from "../../../database/connectDb";
import User from "../../../database/models/User";
import { getRandomUserList } from "../../../factories/usersFactory";
import environment from "../../../loadEnvironment";
import app from "../../app";
import type { UpdateRelationshipBody } from "../../controllers/profilesControllers/types";
import type { UserWithIdStructure } from "../../controllers/usersControllers/types";

const { jwtSecret } = environment;

let server: MongoMemoryServer;
const users = getRandomUserList(10);
const requestUser = users[0] as UserWithIdStructure;
const requestUserToken = jwt.sign(
  { username: requestUser.username, id: requestUser._id.toString() },
  jwtSecret
);

const targetUser = users[1] as UserWithIdStructure;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());

  await User.create(users);
});

afterAll(async () => {
  await server.stop();
  await mongoose.disconnect();
});

describe("Given a GET /profiles endpoint", () => {
  const profilesEndpoint = "/profiles";

  describe("When it receives a request with valid token and there are 10 profiles in the database", () => {
    test("Then it should respond with a list of 9 profiles and status 200", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .get(profilesEndpoint)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("profiles");
      expect(response.body.profiles).toHaveLength(9);
    });
  });

  describe("When it receives a request with an invalid token", () => {
    test("Then it should respond with status 401 and message 'Invalid token'", async () => {
      const expectedStatus = 401;
      const expectedError = "Invalid token";

      const response = await request(app)
        .get(profilesEndpoint)
        .set("Authorization", "Bearer 1234")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });
});

describe("Given a PUT /profiles/edit endpoint", () => {
  const endpoint = "/profiles/edit";

  describe("When it receives a request with a valid user token and a new email 'newEmail@feisbuk.com'", () => {
    test("Then it should respond with status 201 and the users profile with the updated email", async () => {
      const newEmail = "newEmail@feisbuk.com";
      const expectedUser = {
        ...requestUser,
        email: newEmail,
        id: requestUser._id,
      };
      delete expectedUser._id;
      delete expectedUser.password;
      const expectedStatus = 201;

      const response = await request(app)
        .put(endpoint)
        .send({ email: newEmail })
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("profile");
    });
  });
});

describe("Given a PUT /profiles/edit endpoint", () => {
  const endpoint = "/profiles/edit";

  describe("When it receives a request with a correct token and image: testimage.jpg", () => {
    test("Then it should respond with status 201 and the updated user profile with an image and backupImage with links to the new file", async () => {
      const timeStamp = Date.now();
      Date.now = jest.fn().mockReturnValue(timeStamp);
      const fileData = await fs.readFile("src/mocks/testimage.jpg");
      const expectedStatus = 201;
      const expectedFileName = `testimage-${timeStamp}.jpg`;

      const response: { body: { profile: UserWithIdStructure } } =
        await request(app)
          .put(endpoint)
          .set("Authorization", `Bearer ${requestUserToken}`)
          .attach("image", fileData, `${__dirname}/testimage.jpg`)
          .expect(expectedStatus);

      expect(response.body).toHaveProperty("profile");

      const {
        body: {
          profile: { image, backupImage },
        },
      } = response;

      expect(image).toContain(expectedFileName);
      expect(backupImage).toContain(expectedFileName);
    });
  });
});

describe("Given a PUT /profiles/relationship endpoint", () => {
  const endpoint = "/profiles/relationship";

  describe(`When it receives an correct token and a request to add ${targetUser.username} to friends`, () => {
    test("Then it should respond with 201 and an updated profile with the target user in friends", async () => {
      const expectedStatus = 201;
      const body: UpdateRelationshipBody = {
        currentUser: requestUser.username,
        relationship: "friends",
        targetUser: targetUser.username,
        targetUserId: targetUser._id,
      };

      const expectedFriends = [new mongoose.Types.ObjectId(targetUser._id)];

      const response: { body: { profile: UserWithIdStructure } } =
        await request(app)
          .put(endpoint)
          .send(body)
          .set("Authorization", `Bearer ${requestUserToken}`)
          .expect(expectedStatus);

      expect(response.body).toHaveProperty("profile");

      const {
        body: {
          profile: { friends },
        },
      } = response;

      expect(JSON.stringify(friends)).toStrictEqual(
        JSON.stringify(expectedFriends)
      );
    });
  });

  describe(`When it receives an correct token and a request to add ${targetUser.username} to enemies`, () => {
    test("Then it should respond with 201 and an updated profile with the target user in enemies and an empty friends array", async () => {
      const expectedStatus = 201;
      const body: UpdateRelationshipBody = {
        currentUser: requestUser.username,
        relationship: "enemies",
        targetUser: targetUser.username,
        targetUserId: targetUser._id,
      };

      const expectedEnemies = [new mongoose.Types.ObjectId(targetUser._id)];
      const expectedFriends = [] as mongoose.Types.ObjectId[];

      const response: { body: { profile: UserWithIdStructure } } =
        await request(app)
          .put(endpoint)
          .send(body)
          .set("Authorization", `Bearer ${requestUserToken}`)
          .expect(expectedStatus);

      expect(response.body).toHaveProperty("profile");

      const {
        body: {
          profile: { friends, enemies },
        },
      } = response;

      expect(JSON.stringify(enemies)).toStrictEqual(
        JSON.stringify(expectedEnemies)
      );
      expect(friends).toStrictEqual(expectedFriends);
    });
  });

  describe(`When it receives an correct token and a request to remove ${targetUser.username}`, () => {
    test("Then it should respond with 201 and an updated profile with enemies and friends empty", async () => {
      const expectedStatus = 201;
      const body: UpdateRelationshipBody = {
        currentUser: requestUser.username,
        relationship: "removed",
        targetUser: targetUser.username,
        targetUserId: targetUser._id,
      };

      const expectedEnemies = [] as mongoose.Types.ObjectId[];
      const expectedFriends = [] as mongoose.Types.ObjectId[];

      const response: { body: { profile: UserWithIdStructure } } =
        await request(app)
          .put(endpoint)
          .send(body)
          .set("Authorization", `Bearer ${requestUserToken}`)
          .expect(expectedStatus);

      expect(response.body).toHaveProperty("profile");

      const {
        body: {
          profile: { friends, enemies },
        },
      } = response;

      expect(friends).toStrictEqual(expectedFriends);
      expect(enemies).toStrictEqual(expectedEnemies);
    });
  });
});
