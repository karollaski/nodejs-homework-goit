const contactsService = require("../services/contact.service");
const validation = require("../utils/validation");

const get = async (req, res, next) => {
  try {
    const { query } = req;
    const results = await contactsService.getAllContacts(query);
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await contactsService.getOneContact(id);
    if (!results) {
      res.status(404).json({
        status: "not-found",
        code: 404,
        data: {
          contact: results,
        },
      });
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        contact: results,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "error",
      code: 400,
      data: {
        message: e.message,
      },
    });
  }
};

const create = async (req, res, next) => {
  try {
    // const { body } = req;
    const body = await validation.validateAsync(req.body);
    const results = await contactsService.createContact(body);
    res.json({
      status: "success",
      code: 201,
      data: {
        contact: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { body } = req;
    const body = await validation.validateAsync(req.body);
    const results = await contactsService.updateContact(id, body);
    results
      ? res.json({
          status: "success",
          code: 200,
          data: {
            contact: results,
          },
        })
      : res.status(404).json({
          status: 404,
          message: "Not Found",
        });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.details[0].message ?? "Bad Request",
    });
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { favorite } = req.body;
    const { favorite } = await validation.validateAsync(req.body);
    const results = await contactsService.updateFavoriteContact(id, favorite);
    results
      ? res.json({
          status: "success",
          code: 200,
          data: {
            contact: results,
          },
        })
      : res.status(404).json({
          status: 404,
          message: "Not Found",
        });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.details[0].message ?? "Bad Request",
    });
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await contactsService.removeContact(id);
    results
      ? res.json({
          status: "success",
          code: 200,
          message: "contact deleted",
          data: {
            contact: results,
          },
        })
      : res.status(404).json({
          status: 404,
          message: "Not Found",
        });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateFavorite,
  remove,
};
