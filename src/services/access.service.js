"use strict";

const userModules = require("../models/user.models");
const RoleService = require("./role.service");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { getInfoData } = require("../utils");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
// service
const UserService = require("./user.service");
const RoleUser = {
  ADMIN: "1111",
  MANAGER: "0011",
  STAFF: "0000",
};
class AccessService {
  /*
    1 - check email in db
    2 - match Password
    3 - create AT and RT and save
    4 - generate Token
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundUser = await UserService.findByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError("User not found");
    }
    console.log("User:::", foundUser);
    // 2
    const match = bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new AuthFailureError("Error: Authentication error");
    }
    // 4 generate Token
    const { _id: userId, roles: role } = foundUser;
    // 5 find Role
    const userRole = await RoleService.findById(role);
    console.log("User Role:::", userRole);
    const tokens = await createTokenPair(
      { userId, email, role: userRole.name },
      process.env.PUBLIC_KEY,
      process.env.PRIVATE_KEY
    );
    return {
      tokens,
    };
  };
  static signUp = async ({ username, email, password, role }) => {
    // try {
    // step 1: check Email exists
    const holderUser = await userModules.findOne({ email: email }).lean();
    if (holderUser) {
      throw new BadRequestError("Error: User Already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // find role
    const roles = await RoleService.findByName(role);
    if (!roles) {
      throw new BadRequestError("Error: Roles not found");
    }
    const newUser = await userModules.create({
      username,
      email,
      password: passwordHash,
      roles: roles._id,
    });
    if (newUser) {
      return {
        code: 201,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  static handleRefreshToken = async ({ user, refreshToken }) => {
    console.log("User:", user);
    const { userId, email } = user;
    console.log("Refresh Token::::", refreshToken);
    // check UserId
    const foundUser = await UserService.findByEmail({ email });
    if (!foundUser) throw new AuthFailureError("User is not registered ");
    // create new token
    const tokens = await createTokenPair(
      { userId, email },
      process.env.PUBLIC_KEY,
      process.env.PRIVATE_KEY
    );
    return {
      accessToken: tokens.accessToken,
    };
  };
}

module.exports = AccessService;
