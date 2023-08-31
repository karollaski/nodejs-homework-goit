const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/current", authController.getCurrent);

module.exports = router;
