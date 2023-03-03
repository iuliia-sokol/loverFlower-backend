const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const gravatar = require("gravatar");

const { Product } = require("../models/product");
const { HttpError, ctrlWrapper } = require("../helpers");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const avatarWidth = 255;
const avatarHeight = 355;

const getAll = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const filters = {};
  const result = await Product.find(filters, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  let filters = {};
  if (id) {
    filters = { ...filters, _id: id };
  }
  const result = await Product.findById(filters, "-createdAt -updatedAt");
  if (!result) {
    throw HttpError(404, `Product with ${id} not found`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { name } = req.body;
  const avatarURL = gravatar.url(name);
  const result = await Product.create({ ...req.body, avatarURL: avatarURL });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Product with ${id} not found`);
  }
  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByIdAndRemove({ _id: id });
  if (!result) {
    throw HttpError(404, `Product with id ${id} not found`);
  }
  res.json({
    message: "The product was successfully deleted",
  });
};

const updateAvatar = async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    throw HttpError(400, "Avatar must be provided");
  }
  const { path: tempUpload, originalname } = req.file;

  const uniqueID = nanoid();
  const filename = `${uniqueID}${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  const avatarURL = path.join("avatars", filename);

  await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(avatarWidth, avatarHeight).write(tempUpload);
    })
    .catch((err) => {
      throw err;
    });

  await fs.rename(tempUpload, resultUpload);
  await Product.findByIdAndUpdate(id, { avatarURL });
  res.json({
    avatarURL,
  });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateAvatar: ctrlWrapper(updateAvatar),
};
