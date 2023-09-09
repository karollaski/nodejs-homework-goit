const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const validation = require("../utils/validationUser");
const service = require("../services/service");
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const nodemailer = require("nodemailer");
require("dotenv").config();

const config = require("../config/config");
const { nanoid } = require("nanoid");
const emailService = require("../services/email.service");

const signup = async (req, res, next) => {
  const { email, password, subscription } = await validation.validateAsync(
    req.body
  );
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const verificationToken = nanoid();
    const newUser = new User({ email, verificationToken });
    const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "mp" }, true);

    newUser.setPassword(password);
    await newUser.save();

    const verifyEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click verify email</a>`,
    };

    const result = await emailService.send(verifyEmail);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
        user: {
          email: email,
          subscription: subscription,
          avatarURL: avatarURL,
          verificationToken: verificationToken,
        },
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({
      status: "Not found",
      code: 404,
      message: "User not found",
    });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const repeatEmailVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!email) {
    return res.status(400).json({
      code: 404,
      message: "missing required field email",
    });
  }

  if (!user) {
    return res.status(404).json({
      status: "Not found",
      code: 404,
      message: "User not found",
    });
  }

  if (user.verify) {
    return res.status(400).json({
      code: 404,
      message: "Verification has already been passed",
    });
  }

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  const result = await emailService.send(verifyEmail);

  res.status(200).json({
    data: {
      message: "Verification email sent",
      result,
    },
  });
};

const login = async (req, res) => {
  const { email, password, subscription } = await validation.validateAsync(
    req.body
  );
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  if (!user.verify) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Email not verified",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: {
        email: email,
        subscription: subscription,
      },
    },
  });
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.body;
    await service.updateUser({ _id }, { token: null });
    res.status(204).end();
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { _id, email, subscription } = req.body;
    const user = await service.getUser({ _id });

    res.json({
      status: 200,
      statusText: "success",
      data: {
        user: {
          email: email,
          subscription: subscription,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const updateAvatar = async (req, res) => {
  const { _id } = req.body;
  const id = _id;
  const { path: tmpUpload, originalname } = req.file;
  const avatar = await Jimp.read(tmpUpload);
  await avatar.autocrop().cover(250, 250).writeAsync(tmpUpload);

  const filename = `${Date.now()}-${originalname}`;
  const resultUpload = path.join(config.AVATAR_PATH, filename);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

module.exports = {
  signup,
  verifyEmail,
  repeatEmailVerify,
  login,
  logout,
  getCurrent,
  updateAvatar,
};
