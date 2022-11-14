import multer from "multer";
import { Router } from "express";
import {
  editProfile,
  getProfiles,
} from "../../controllers/profilesControllers/profilesControllers.js";
import path from "path";
import handleImage from "../../middleware/images/handleImage.js";

const upload = multer({ dest: path.join("assets", "images") });

// eslint-disable-next-line new-cap
const profilesRouter = Router();

profilesRouter.get("", getProfiles);

profilesRouter.put("/edit", upload.single("image"), handleImage, editProfile);

export default profilesRouter;
