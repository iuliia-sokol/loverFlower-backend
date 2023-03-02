const { Product } = require("../models/product");
const { HttpError, ctrlWrapper } = require("../helpers");

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
  const result = await Product.create({ ...req.body });
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

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
