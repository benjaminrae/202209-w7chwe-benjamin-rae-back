import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import connectDb from "../../../database/connectDb";
import User from "../../../database/models/User";
import { getRandomUserList } from "../../../factories/usersFactory";
import environment from "../../../loadEnvironment";
import app from "../../app";
import type { UserWithIdStructure } from "../../controllers/usersControllers/types";

const { jwtSecret } = environment;

let server: MongoMemoryServer;
const users = getRandomUserList(10);
const requestUser = users[0] as UserWithIdStructure;
const requestUserToken = jwt.sign(
  { username: requestUser.username, id: requestUser._id.toString() },
  jwtSecret
);

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
