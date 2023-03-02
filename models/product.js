const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { mongooseHandleError } = require("../helpers");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    tags: {
      type: Array,
      required: true,
      default: [],
    },
    colors: {
      type: Array,
      required: true,
      default: [],
    },
    format: {
      type: Array,
      required: true,
      default: [],
    },
    contrast: {
      type: Boolean,
      default: false,
      required: false,
    },
    flowers: {
      type: Array,
      required: true,
      default: [],
    },
    price: {
      type: String,
      required: true,
      default: "0",
    },
    popular: {
      type: Boolean,
      default: false,
    },
    sale: {
      type: Boolean,
      default: false,
    },
    avatarURL: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

productSchema.post("save", mongooseHandleError);

const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  tags: Joi.array().required(),
  colors: Joi.array().required(),
  format: Joi.array().required(),
  flowers: Joi.array().required(),
  price: Joi.string().required(),
  avatarURL: Joi.string(),
  contrast: Joi.boolean(),
  popular: Joi.boolean(),
  sale: Joi.boolean(),
});

const schemas = {
  addSchema,
};

const Product = model("product", productSchema);

module.exports = {
  Product,
  schemas,
};
