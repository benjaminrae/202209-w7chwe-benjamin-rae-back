import { Schema, model } from "mongoose";

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },
  backupImage: {
    type: String,
  },
  birthday: {
    type: String,
  },
  friends: {
    type: [Schema.Types.ObjectId],
  },
  enemies: {
    type: [Schema.Types.ObjectId],
  },
});

const User = model("User", userSchema, "users");

export default User;
