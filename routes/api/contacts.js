import express from "express";

import { isEmptyBody } from "../../middlewares/index.js";

import contactsControler from "../../controlers/contacts-controler.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControler.getAllContacts);

contactsRouter.get("/:contactId", contactsControler.getById);

contactsRouter.post("/", isEmptyBody, contactsControler.addContact);

contactsRouter.delete("/:contactId", contactsControler.deleteById);

contactsRouter.put("/:contactId", isEmptyBody, contactsControler.updateById);

export default contactsRouter;
