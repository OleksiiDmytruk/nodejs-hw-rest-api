import contactsServis from "../models/contacts.js";

import { HttpError } from "../helpers/index.js";

import {
  contactAddSchema,
  contactUpdateSchema,
} from "../schemas/contact-schemas.js";

const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsServis.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsServis.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    console.log(req.body);
    console.log(error);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsServis.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsServis.removeContact(contactId);
    if (!result) {
      throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing field");
    }
    const { contactId } = req.params;
    const result = await contactsServis.updateContact(contactId, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getById,
  addContact,
  deleteById,
  updateById,
};
