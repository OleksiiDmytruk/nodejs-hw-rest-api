import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import "dotenv/config";

import User from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { tryCatchWrapper } from "../decorators/index.js";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const register = tryCatchWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email, { s: "250" });
  const verificationToken = nanoid();
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

const verify = tryCatchWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.updateOne(
    { verificationToken },
    { verify: true, verificationToken: null }
  );
  res.json({
    message: "Verification successful",
  });
});

const resendVerifyEmail = tryCatchWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
});

const login = tryCatchWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

const logout = tryCatchWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({});
});

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    user: {
      email,
      subscription,
    },
  });
};

const updateSubscription = tryCatchWrapper(async (req, res) => {
  const { email, subscription } = req.body;
  const result = await User.findOneAndUpdate({ email }, { subscription });
  res.json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
});

const addAvatar = tryCatchWrapper(async (req, res) => {
  const { _id, email } = req.user;
  const { path: oldPath, filename } = req.file;
  const owner = _id.toString();
  Jimp.read(oldPath)
    .then((img) => {
      return img.resize(250, 250);
    })
    .catch((error) => {
      throw HttpError(404, error.message);
    });
  const avatarName = `${owner}_${filename}`;
  const newPath = path.join(avatarsPath, avatarName);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", avatarName);
  const result = await User.findOneAndUpdate({ email }, { avatarURL });

  res.json({
    avatarURL: result.avatarURL,
  });
});

export default {
  register,
  verify,
  resendVerifyEmail,
  login,
  logout,
  getCurrent,
  updateSubscription,
  addAvatar,
};
