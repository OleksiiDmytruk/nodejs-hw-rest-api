import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { tryCatchWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const authenticate = tryCatchWrapper(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw HttpError(401, "Authorization header not found");
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw HttpError(401, "Not authorized");
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    throw HttpError(401, error.message);
  }
});

export default authenticate;
