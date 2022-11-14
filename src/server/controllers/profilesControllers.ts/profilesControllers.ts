import type { CustomRequest, EditProfileRequestBody } from "./types";
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

export const editProfile = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    EditProfileRequestBody
  >,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const profile = req.body;

  try {
    const updatedProfile = await User.findByIdAndUpdate(userId, profile, {
      returnDocument: "after",
    }).select("-password");

    res.status(201).json({ profile: updatedProfile });
  } catch (error: unknown) {
    next(error);
  }
};
