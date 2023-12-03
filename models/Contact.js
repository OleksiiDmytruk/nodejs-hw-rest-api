import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const nameRegExp =
  /^[a-zA-Zа-щьюяґєіїА-ЩЬЮЯҐЄІЇ]+(([' \\-][a-zA-Zа-щьюяґєіїА-ЩЬЮЯҐЄІЇ ])?[a-zA-Zа-щьюяґєіїА-ЩЬЮЯҐЄІЇ]*)*$/;
const emailRegExp =
  /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegExp = /^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$/;

const contactShema = new Schema(
  {
    name: {
      type: String,
      match: nameRegExp,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      unique: true,
      match: emailRegExp,
    },
    phone: {
      type: String,
      match: phoneRegExp,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

export const contactAddSchema = Joi.object({
  name: Joi.string().pattern(nameRegExp).required(),
  email: Joi.string().email().pattern(emailRegExp).required(),
  phone: Joi.string().pattern(phoneRegExp).required(),
  favorite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().pattern(nameRegExp),
  email: Joi.string().email().pattern(emailRegExp),
  phone: Joi.string().pattern(phoneRegExp),
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
