"use strict";
const express = require("express");
const router = express.Router();

// check permissions
router.use("/v1/api", require("./role"));
router.use("/v1/api", require("./user"));
module.exports = router;
