"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      data: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK",
      data: await AccessService.signUp(req.body),
    }).send(res);
  };
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Token success",
      data: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
      }),
    }).send(res);
  };
}
module.exports = new AccessController();
