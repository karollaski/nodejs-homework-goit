const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const validation = require("../utils/validationUser");
const service = require("../services/service");
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const config = require("../config/config");

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
    const newUser = new User({ email });
    const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "mp" }, true);

    newUser.setPassword(password);
    await newUser.save();
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
        user: {
          email: email,
          subscription: subscription,
          avatarURL: avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
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
  login,
  logout,
  getCurrent,
  updateAvatar,
};
