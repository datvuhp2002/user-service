"use strict";
const express = require("express");
const roleController = require("../../controllers/role.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// create
router.post("/role/create", asyncHandler(roleController.create));
// getAll
router.get("/role/getAll", asyncHandler(roleController.getAll));

module.exports = router;
