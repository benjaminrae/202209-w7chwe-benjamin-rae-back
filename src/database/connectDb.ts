import environment from "../loadEnvironment.js";
import mongoose from "mongoose";

const { mongoDebug } = environment;

const connectDb = async (mongoDbUri: string) => {
  await mongoose.connect(mongoDbUri);

  mongoose.set("debug", mongoDebug);

  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ret;
    },
  });
};

export default connectDb;
