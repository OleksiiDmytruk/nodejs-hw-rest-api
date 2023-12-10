import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";
import { validationRegexp } from "../helpers/index.js";

const userShema = new Schema(
  {
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: validationRegexp.emailRegExp,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    avatarURL: String,
  },
  { versionKey: false, timestamps: true }
);

export const userAuthSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "missing required {#label} field",
  }),
  email: Joi.string().pattern(validationRegexp.emailRegExp).messages({
    "any.required": "missing required {#label} field",
    "string.pattern.base": "Invalid {#label} format.",
  }),
});

export const updateSubscriptionSchema = Joi.object({
  email: Joi.string().pattern(validationRegexp.emailRegExp).messages({
    "any.required": "missing required {#label} field",
    "string.pattern.base": "Invalid {#label} format.",
  }),
  subscription: Joi.string().required().messages({
    "any.required": "missing required {#label} field",
  }),
});

userShema.post("save", handleSaveError);

userShema.pre("findOneAndUpdate", preUpdate);

userShema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userShema);

export default User;
