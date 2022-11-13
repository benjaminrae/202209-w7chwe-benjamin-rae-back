import { Router } from "express";
import { getProfiles } from "../../controllers/profilesControllers.ts/profilesControllers.js";

// eslint-disable-next-line new-cap
const profilesRouter = Router();

profilesRouter.get("", getProfiles);

export default profilesRouter;
