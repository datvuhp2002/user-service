"use strict";
const express = require("express");
const router = express.Router();

// check permissions
router.use("/services/api/user/role", require("./role"));
router.use("/services/api/user", require("./user"));
module.exports = router;
