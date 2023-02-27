const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { mongooseHandleError } = require("../helpers");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

productSchema.post("save", mongooseHandleError);

const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  favorite: Joi.boolean(),
});

const schemas = {
  addSchema,
};

const Product = model("product", productSchema);

module.exports = {
  Product,
  schemas,
};
