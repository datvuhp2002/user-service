"use strict";

const UserModel = require("../models/user.models");
const { getInfoData } = require("../utils");
class UserService {
  static create = async ({ name }) => {
    return await UserModel.create({
      name: name,
    });
  };
  static getAll = async () => {
    const users = await UserModel.find().lean();
    return {
      metadata: getInfoData({
        fields: ["_id", "username", "email"],
        object: users,
      }),
    };
  };
  static findByName = async ({ name }) => {
    return await UserModel.findOne({ name });
  };
  static findByEmail = async ({ email }) => {
    return await UserModel.findOne({ email });
  };
}
module.exports = UserService;
