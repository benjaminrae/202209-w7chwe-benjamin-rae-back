import multer from "multer";
import { Router } from "express";
import {
  editProfile,
  getProfileById,
  getProfiles,
  updateRelationship,
} from "../../controllers/profilesControllers/profilesControllers.js";
import path from "path";
import handleImage from "../../middleware/images/handleImage.js";
import routes from "../routes.js";

const upload = multer({ dest: path.join("assets", "images") });

const { profileRoute, editRoute, relationshipRoute } = routes;

// eslint-disable-next-line new-cap
const profilesRouter = Router();

profilesRouter.get("", getProfiles);

profilesRouter.put(editRoute, upload.single("image"), handleImage, editProfile);

profilesRouter.get(profileRoute, getProfileById);

profilesRouter.put(relationshipRoute, updateRelationship);

export default profilesRouter;
