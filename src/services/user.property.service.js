"use strict";
const prisma = require("../prisma");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { select } = require("./user.service");
class UserPropertyService {
  static create = async ({ role_id, user_id, department_id }) => {
    console.log("Role id:::", role_id);
    console.log("User id:::", user_id);
    const newUserProperty = await prisma.userProperty.create({
      data: {
        role_id,
        user_id,
        department_id,
      },
    });
    if (newUserProperty) {
      return {
        code: 201,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
  static getAll = async () => {
    return await prisma.user.findMany({
      select: {
        user_id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  };
  static findUserByRole = async (role_id) => {
    const users_id = await prisma.userProperty.findMany({
      where: { role_id },
      select: { user_id: true },
    });
    return users_id;
  };
  static findUserByRoleAndDepartment = async (role_id) => {
    const users_id = await prisma.userProperty.findMany({
      where: { role_id },
      select: { user_id: true },
    });
    return users_id;
  };
}
module.exports = UserPropertyService;
