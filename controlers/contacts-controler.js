import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import tryCatchWrapper from "../decorators/tryCatchWrapper.js";

const getAllContacts = tryCatchWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...filterParams } = req.query;
  const skip = (page - 1) * limit;
  const filter = { owner, ...filterParams };
  const result = await Movie.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  const total = await Movie.countDocuments(filter);

  res.json({
    result,
    total,
  });
});

const getById = tryCatchWrapper(async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
});

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
