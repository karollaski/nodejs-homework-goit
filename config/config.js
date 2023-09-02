const path = require("node:path");

const getUploadPath = () => {
  return path.join(process.cwd(), "tmp");
};

const getAvatarPath = () => {
  return path.join(process.cwd(), "public", "avatars");
};

module.exports = {
  UPLOAD_PATH: getUploadPath(),
  AVATAR_PATH: getAvatarPath(),
};
