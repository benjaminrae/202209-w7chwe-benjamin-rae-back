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

  const receivedProfile = req.body;

  try {
    const profile = await User.findByIdAndUpdate(userId, receivedProfile, {
      returnDocument: "after",
    })
      .select("-password")
      .exec();

    res.status(201).json({
      profile: {
        ...profile.toJSON(),
        image: profile.image
          ? `${req.protocol}://${req.get("host")}/${profile.image}`
          : "",
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};
