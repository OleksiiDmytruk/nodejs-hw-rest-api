import express from "express";

import {
  authenticate,
  isEmptyBody,
  isValidId,
} from "../../middlewares/index.js";

import { contactsControler } from "../../controlers/index.js";
import { validateBody } from "../../decorators/index.js";
import {
  contactAddSchema,
  contactUpdateSchema,
  contactChangeFavoriteSchema,
} from "../../models/Contact.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControler.getAllContacts);

contactsRouter.get("/:contactId", isValidId, contactsControler.getById);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsControler.addContact
);

contactsRouter.delete("/:contactId", isValidId, contactsControler.deleteById);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateBody(contactUpdateSchema),
  contactsControler.updateById
);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  validateBody(contactChangeFavoriteSchema),
  contactsControler.updateById
);

export default contactsRouter;
