import multer from "multer";
import { Router } from "express";
import {
  editProfile,
  getProfiles,
} from "../../controllers/profilesControllers/profilesControllers.js";
import path from "path";

const upload = multer({ dest: path.join("assets", "images") });

// eslint-disable-next-line new-cap
const profilesRouter = Router();

profilesRouter.get("", getProfiles);

profilesRouter.put("/edit", upload.single("image"), editProfile);

export default profilesRouter;
