import express from "express";
import { authenticate, isEmptyBody } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { userAuthSchema, updateSubscriptionSchema } from "../../models/User.js";
import { authControler } from "../../controlers/index.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userAuthSchema),
  authControler.register
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userAuthSchema),
  authControler.login
);

authRouter.post("/logout", authenticate, authControler.logout);

authRouter.get("/current", authenticate, authControler.getCurrent);

authRouter.patch(
  "/subscription",
  authenticate,
  isEmptyBody,
  validateBody(updateSubscriptionSchema),
  authControler.updateSubscription
);

export default authRouter;
