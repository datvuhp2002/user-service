"use strict";

const { SuccessResponse } = require("../core/success.response");
const { newTemplate } = require("../services/template.service");
const { verifyToken } = require("../services/email.service");
class EmailController {
  newTemplate = async (req, res, next) => {
    new SuccessResponse({
      message: "new template",
      data: await newTemplate(req.body),
    }).send(res);
  };
  verifyToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Xác thực mã thành công",
      data: await verifyToken(req.body),
    }).send(res);
  };
}
module.exports = new EmailController();
