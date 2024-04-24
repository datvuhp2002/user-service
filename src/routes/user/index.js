"use strict";
const express = require("express");
const UserController = require("../../controllers/user.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { permissions } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// AUTHENTICATION
router.use(authentication);
//
router.use(permissions("1111"));
router.get("/admin/user/getAll", asyncHandler(UserController.getAll));
module.exports = router;
