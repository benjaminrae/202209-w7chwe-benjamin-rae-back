import type { CustomRequest } from "./types";
import type { NextFunction, Response } from "express";
import User from "../../../database/models/User.js";

export const getProfiles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  try {
    const profiles = await User.find({ _id: { $ne: userId } })
      .select("-password")
      .exec();

    res.status(200).json({ profiles });
  } catch (error: unknown) {
    next(error);
  }
};
