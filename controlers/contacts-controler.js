import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import tryCatchWrapper from "../decorators/tryCatchWrapper.js";

const getAllContacts = tryCatchWrapper(async (_, res) => {
  const result = await Contact.find({}, "-createdAt -updatedAt");
  res.json(result);
});

const getById = tryCatchWrapper(async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
});

// hshcbhsbebsubfbsuvdb

const addContact = tryCatchWrapper(async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
});

const deleteById = tryCatchWrapper(async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json({ message: "Contact deleted" });
});

const updateById = tryCatchWrapper(async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  res.json(result);
});

export default {
  getAllContacts,
  getById,
  addContact,
  deleteById,
  updateById,
};
