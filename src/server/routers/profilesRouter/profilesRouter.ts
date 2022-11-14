import { Router } from "express";
import {
  editProfile,
  getProfiles,
} from "../../controllers/profilesControllers.ts/profilesControllers.js";

// eslint-disable-next-line new-cap
const profilesRouter = Router();

profilesRouter.get("", getProfiles);

profilesRouter.put("/edit", editProfile);

export default profilesRouter;
