import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import connectDb from "../../database/connectDb";
import mongoose from "mongoose";
import app from "../app";
import routes from "./routes";
import { getRandomUser } from "../../factories/usersFactory";
import environment from "../../loadEnvironment";
import User from "../../database/models/User";
import type { RegisterUserBody } from "../controllers/types";

const { saltLength } = environment;

let server: MongoMemoryServer;
const user = getRandomUser();
const unhashedPassword = user.password;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());

  const hashedPassword = await bcrypt.hash(user.password, saltLength);

  await User.create({ ...user, password: hashedPassword });
});

afterAll(async () => {
  await server.stop();
  await mongoose.disconnect();
});

describe("Given the POST /users/register endpoint", () => {
  const registerEndpoint = `${routes.usersRoute}${routes.registerRoute}`;
  describe("When it receives a request with no user details in the body", () => {
    test("Then it should respond with a message that starts with 'The details you provided don't meet the requirements:' and status 400", async () => {
      const expectedStatus = 400;
      const expectedError = `The details you provided don't meet the requirements: "username" is required, "email" is required, "password" is required`;

      const response = await request(app)
        .post(registerEndpoint)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });

  describe("When it receives a request with a user's details that already exist in the database", () => {
    test("Then it should respond with a message 'User is already registered' and status 409", async () => {
      const expectedStatus = 409;
      const expectedError = "User is already registered";
      const body: RegisterUserBody = {
        username: user.username,
        email: user.email,
        password: unhashedPassword,
        confirmPassword: unhashedPassword,
      };

      const response = await request(app)
        .post(registerEndpoint)
        .send(body)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });

  describe("When it receives a request with a user's details that aren't registered in the database", () => {
    test("Then it should respond with the new user and their details and status 201", async () => {
      const expectedStatus = 201;
      const newUser = getRandomUser();
      const body: RegisterUserBody = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        confirmPassword: newUser.password,
      };

      const response = await request(app)
        .post(registerEndpoint)
        .send(body)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("username", newUser.username);
      expect(response.body.user).toHaveProperty("email", newUser.email);
      expect(response.body.user).toHaveProperty("id");
    });
  });
});
