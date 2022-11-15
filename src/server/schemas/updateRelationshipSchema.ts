import { Joi } from "express-validation";
import type {
  Relationships,
  UpdateRelationshipBody,
} from "../controllers/profilesControllers/types";

const updateRelationshipSchema = {
  body: Joi.object<UpdateRelationshipBody>({
    currentUser: Joi.string().required(),
    relationship: Joi.string<Relationships>().valid(
      "friends",
      "enemies",
      "removed"
    ),
    targetUser: Joi.string().required(),
    targetUserId: Joi.string().required(),
  }),
};

export default updateRelationshipSchema;
