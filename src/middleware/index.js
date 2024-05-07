"use strict";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary.config");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormat: ["jpg", "png", "jpeg"],
  params: {
    folder: (req, file) => `avatar/${req.headers.user}`,
    format: async (req, file) => {
      return "jpeg";
    },
    public_id: (req, file) => file.originalname,
  },
});
const upload = multer({
  storage: storage,
});

module.exports = { upload };
