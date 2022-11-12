import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { UserStructure } from "../server/controllers/types";

const usersFactory = Factory.define<UserStructure>(() => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  birthday: faker.date.birthdate().getTime().toString(),
  location: faker.address.cityName(),
  image: faker.image.avatar(),
}));

export const getRandomUser = () => usersFactory.build();

export const getRandomUserList = (number: number) =>
  usersFactory.buildList(number);
