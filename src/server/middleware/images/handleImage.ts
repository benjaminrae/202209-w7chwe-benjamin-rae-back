import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import type { NextFunction, Response } from "express";
import path from "path";
import type { CustomRequest } from "../../controllers/profilesControllers/types";

import environment from "../../../loadEnvironment.js";
import type { UserStructure } from "../../controllers/usersControllers/types";

const { supabaseBucket, supabaseKey, supabaseUrl } = environment;

const supabase = createClient(supabaseUrl, supabaseKey);
const bucket = supabase.storage.from(supabaseBucket);

const handleImage = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    UserStructure
  >,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const timeStamp = Date.now();

  const fileExtension = path.extname(req.file.originalname);
  const fileBaseName = path.basename(req.file.originalname, fileExtension);
  const newFileName = `${fileBaseName}-${timeStamp}${fileExtension}`;
  const newFilePath = path
    .join("assets", "images", newFileName)
    .replaceAll(`\\`, "/");

  try {
    await fs.rename(
      path.join("assets", "images", req.file.filename),
      newFilePath
    );

    const imageContents = await fs.readFile(newFilePath);

    await bucket.upload(newFileName, imageContents);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(newFileName);

    req.body.image = newFilePath;
    req.body.backupImage = publicUrl;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default handleImage;
