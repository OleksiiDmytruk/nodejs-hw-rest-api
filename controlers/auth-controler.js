import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { tryCatchWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const register = tryCatchWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

const login = tryCatchWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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

export default {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
};
