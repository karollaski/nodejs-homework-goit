const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user.controller");
const multer = require("multer");
const config = require("../../config/config");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage,
});

router.post("/signup", authController.signup);
router.get("/verify/:verificationToken", authController.verifyEmail);
router.post("/verify", authController.repeatEmailVerify);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/current", authController.getCurrent);

router.patch("/avatars", upload.single("avatar"), authController.updateAvatar);

module.exports = router;
