const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("node:fs").promises;
const config = require("./config/config");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json());
require("./config/passport");
app.use(express.static("public"));

const contactsRouter = require("./routes/api/contacts");
const userRoutes = require("./routes/api/user.routes");
app.use("/api/", contactsRouter);
app.use("/api/user", userRoutes);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts or /api/user",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DATABASE_URL;

const connection = mongoose.connect(uriDb, {
  //   dbName: "db-contacts",
  useUnifiedTopology: true,
  //   useFindAndModify: false,
});

const isAccessible = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder, {
      recursive: true,
    });
  } else {
    console.log("Directories are already created");
  }
};

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, async function () {
      createFolderIsNotExist(config.UPLOAD_PATH);
      createFolderIsNotExist(config.AVATAR_PATH);
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });

module.exports = app;
