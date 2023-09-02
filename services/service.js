const Contact = require("../models/contact.model");
const User = require("../models/user.model");

const getAllContacts = async (query) => {
  return Contact.find(query);
};

const getOneContact = async (id, userId) => {
  return Contact.findOne({ _id: id, owner: userId });
};
const createContact = async (data) => {
  return Contact.create(data);
};

const updateContact = async (id, userId, data) => {
  return Contact.findOneAndUpdate({ _id: id, owner: userId }, data, {
    new: true,
  });
};

const updateFavoriteContact = async (id, userId, favorite) => {
  return Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { favorite },
    {
      new: true,
    }
  );
};

const removeContact = async (id, userId) => {
  return Contact.findOneAndDelete({ _id: id, owner: userId });
};

const updateUser = async (query, body) => {
  try {
    return User.findOneAndUpdate(query, body, {
      runValidators: true,
      new: true,
    });
  } catch (err) {
    console.error(err.message);
  }
};

const getUser = async (query) => {
  try {
    return await User.findOne(query).lean();
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  updateFavoriteContact,
  removeContact,
  updateUser,
  getUser,
};
