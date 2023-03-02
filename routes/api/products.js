const express = require("express");
const router = express.Router();
const { validateBody, isValidId } = require("../../middlewares");
const ctrl = require("../../controllers/products");
const { schemas } = require("../../models/product");

router.get("/", ctrl.getAll);

router.get("/:id", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.addSchema), ctrl.add);

router.delete("/:id", isValidId, ctrl.deleteById);

module.exports = router;
