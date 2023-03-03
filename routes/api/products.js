const express = require("express");
const router = express.Router();
const { validateBody, isValidId, upload } = require("../../middlewares");
const ctrl = require("../../controllers/products");
const { schemas } = require("../../models/product");

router.get("/", ctrl.getAll);

router.get("/:id", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.addSchema), ctrl.add);

router.delete("/:id", isValidId, ctrl.deleteById);

router.patch("/avatars/:id", upload.single("avatarURL"), ctrl.updateAvatar);

module.exports = router;
