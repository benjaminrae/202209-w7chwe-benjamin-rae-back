import fs from "fs/promises";
import type {
  CustomRequest,
  EditProfileRequestBody,
  UpdateRelationshipBody,
} from "./types";
import type { NextFunction, Response } from "express";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";
import mongoose from "mongoose";

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
    const profile = await User.findById(profileId).select("-password").exec();

    if (!profile) {
      next(new CustomError("Profile not found", 404, "Profile not found"));

      return;
    }

    res.status(200).json({ profile });
  } catch (error: unknown) {
    next(error);
  }
};

export const updateRelationship = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    UpdateRelationshipBody
  >,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  const { currentUser, relationship, targetUser, targetUserId } = req.body;

  const relationshipText =
    relationship === "removed"
      ? `Removed relationship: ${currentUser} & ${targetUser}`
      : `New relationship: ${currentUser} & ${targetUser} (${relationship})`;

  try {
    await fs.appendFile(
      "src/server/relationships.txt",
      relationshipText + "\n"
    );

    const user = await User.findById(userId);

    if (relationship === "removed") {
      user.friends = user.friends.filter(
        (friend) => friend.toString() !== targetUserId
      );
      user.enemies = user.enemies.filter(
        (enemy) => enemy.toString() !== targetUserId
      );
    }

    if (relationship === "friends") {
      user.friends.push(new mongoose.Types.ObjectId(targetUserId));
      user.enemies = user.enemies.filter(
        (enemy) => enemy.toString() !== targetUserId
      );
    }

    if (relationship === "enemies") {
      user.friends = user.friends.filter(
        (friend) => friend.toString() !== targetUserId
      );
      user.enemies.push(new mongoose.Types.ObjectId(targetUserId));
    }

    await user.save();

    res.status(201).json({ profile: user });
  } catch (error: unknown) {
    next(error);
  }
};
