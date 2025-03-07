const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contact.controller");
const auth = require("../../middlewares/auth");

router.get("/contacts", auth, contactsController.get);

router.get("/contacts/:id", auth, contactsController.getById);

router.post("/contacts", auth, contactsController.create);

router.put("/contacts/:id", auth, contactsController.update);

router.patch("/contacts/:id/favorite", auth, contactsController.updateFavorite);

router.delete("/contacts/:id", auth, contactsController.remove);

module.exports = router;
