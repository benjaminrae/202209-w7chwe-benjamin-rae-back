import type { InferSchemaType } from "mongoose";
import type { userSchema } from "../../database/models/User";
export interface RegisterUserBody extends LoginUserBody {
  confirmPassword: string;
  email: string;
}

export interface LoginUserBody {
  username: string;
  password: string;
}

export type UserStructure = InferSchemaType<typeof userSchema>;
