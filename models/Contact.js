import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";
import { validationRegexp } from "../helpers/index.js";

const contactShema = new Schema(
  {
    name: {
      type: String,
      match: validationRegexp.nameRegExp,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: true,
      match: validationRegexp.emailRegExp,
    },
    phone: {
      type: String,
      match: validationRegexp.phoneRegExp,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

export const contactAddSchema = Joi.object({
  name: Joi.string().pattern(validationRegexp.nameRegExp).required().messages({
    "any.required": "missing required {#label} field",
    "string.pattern.base": "Invalid {#label} format.",
  }),
  email: Joi.string()
    .pattern(validationRegexp.emailRegExp)
    .required()
    .messages({
      "any.required": "missing required {#label} field",
      "string.pattern.base": "Invalid {#label} format.",
    }),
  phone: Joi.string()
    .pattern(validationRegexp.phoneRegExp)
    .required()
    .messages({
      "any.required": "missing required {#label} field",
      "string.pattern.base": "Invalid {#label} format.",
    }),
  favorite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().pattern(validationRegexp.nameRegExp).messages({
    "string.pattern.base": "Invalid {#label} format.",
  }),
  email: Joi.string().pattern(validationRegexp.emailRegExp).messages({
    "string.pattern.base": "Invalid {#label} format.",
  }),
  phone: Joi.string().pattern(validationRegexp.phoneRegExp).messages({
    "string.pattern.base": "Invalid {#label} format.",
  }),
  favorite: Joi.boolean(),
});

export const contactChangeFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

contactShema.post("save", handleSaveError);

contactShema.pre("findOneAndUpdate", preUpdate);

contactShema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactShema);

export default Contact;
