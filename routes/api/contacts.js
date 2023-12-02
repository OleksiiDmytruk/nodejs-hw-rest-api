import express from "express";

import { isEmptyBody } from "../../middlewares/index.js";

import contactsControler from "../../controlers/contacts-controler.js";
import isValidId from "../../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControler.getAllContacts);

contactsRouter.get("/:contactId", isValidId, contactsControler.getById);

contactsRouter.post("/", isEmptyBody, contactsControler.addContact);

contactsRouter.delete("/:contactId", isValidId, contactsControler.deleteById);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  contactsControler.updateById
);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  contactsControler.changeFavorite
);

export default contactsRouter;
