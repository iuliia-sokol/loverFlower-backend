const { Product } = require("../models/product");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  let filters = { owner };
  if (favorite) {
    filters = { ...filters, favorite };
  }

  const result = await Product.find(filters, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");

  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
};
