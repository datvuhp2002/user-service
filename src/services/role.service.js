"use strict";

const RoleModel = require("../models/role.models");

class RoleService {
  static create = async ({ name }) => {
    return await RoleModel.create({
      name: name,
    });
  };
  static getAll = async () => {
    return RoleModel.find();
  };
  static findByName = async (name) => {
    return await RoleModel.findOne({ name }).lean();
  };
  static findById = async (id) => {
    return await RoleModel.findById({ _id: id });
  };
}
module.exports = RoleService;
