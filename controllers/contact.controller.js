const service = require("../services/service");
const validation = require("../utils/validationContact");

const get = async (req, res, next) => {
  try {
    const { query, user } = req;
    const results = await service.getAllContacts({
      ...query,
      owner: user._id,
    });
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
    const { params, user } = req;
    const { id } = params;
    const results = await service.getOneContact(id, user._id);
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
    const { user } = req;
    const body = await validation.validateAsync(req.body);
    const results = await service.createContact({
      ...body,
      owner: user._id,
    });
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
    const { user } = req;
    const body = await validation.validateAsync(req.body);
    const results = await service.updateContact(id, user._id, body);
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
    const { user } = req;
    const { favorite } = await validation.validateAsync(req.body);
    const results = await service.updateFavoriteContact(id, user._id, favorite);
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
    const { user } = req;
    const results = await service.removeContact(id, user._id);
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
