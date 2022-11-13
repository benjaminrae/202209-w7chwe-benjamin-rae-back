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
    test("Then it should response with a list of 9 profiles and status 200", async () => {
      const response = await request(app)
        .get(profilesEndpoint)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("profiles");
      expect(response.body.profiles).toHaveLength(9);
    });
  });
});
