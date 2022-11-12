import { Joi } from "express-validation";

const loginUserSchema = {
  body: Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(8).required(),
  }),
};

export default loginUserSchema;
