import type { CustomRequest, EditProfileRequestBody } from "./types";
import type { NextFunction, Response } from "express";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError";

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

export const getProfileById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { profileId } = req.params;

  try {
    const profile = await User.findById(profileId);

    if (!profile) {
      next(new CustomError("Profile not found", 404, "Profile not found"));

      return;
    }

    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};
