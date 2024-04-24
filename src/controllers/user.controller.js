"use strict";

const UserService = require("../services/user.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class UserController {
  create = async (req, res, next) => {
    new CREATED({
      message: "created role OK",
      data: await UserService.create(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
  getAll = async (req, res, next) => {
    new OK({
      message: "Get All Ok",
      data: await UserService.getAll(),
    }).send(res);
  };
}

module.exports = new UserController();
