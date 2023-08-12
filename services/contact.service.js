const Contact = require("../models/contact.model");

const getAllContacts = async (query) => {
  return Contact.find(query);
};

const getOneContact = async (id) => {
  return Contact.findById(id);
};

const createContact = async (data) => {
  return Contact.create(data);
};

const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
};

const updateFavoriteContact = async (id, favorite) => {
  return Contact.findByIdAndUpdate(
    id,
    { favorite },
    {
      new: true,
    }
  );
};

const removeContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};

module.exports = {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  updateFavoriteContact,
  removeContact,
};
