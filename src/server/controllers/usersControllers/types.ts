import type { InferSchemaType } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import type { userSchema } from "../../../database/models/User";

export interface RegisterUserBody extends LoginUserBody {
  confirmPassword: string;
  email: string;
}

export interface LoginUserBody {
  username: string;
  password: string;
}

export type UserStructure = InferSchemaType<typeof userSchema>;

export interface UserWithIdStructure extends UserStructure {
  _id: string;
}

export interface UserTokenPayload extends JwtPayload {
  username: string;
  id: string;
}
