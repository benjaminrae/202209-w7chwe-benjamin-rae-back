import type { InferSchemaType } from "mongoose";
import type { userSchema } from "../../database/models/User";
export interface RegisterUserBody {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export type UserStructure = InferSchemaType<typeof userSchema>;
