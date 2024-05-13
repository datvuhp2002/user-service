"use strict";

const { getInfoData } = require("../utils");
const prisma = require("../prisma");
const RoleService = require("./role.service");
const UserProperty = require("./user.property.service");
const UserPropertyService = require("./user.property.service");
const bcrypt = require("bcrypt");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const cloudinary = require("../configs/cloudinary.config");
class UserService {
  static select = {
    user_id: true,
    username: true,
    email: true,
    phone: true,
    avatar: true,
    name: true,
    birthday: true,
    createdAt: true,
    createdBy: true,
    UserProperty: true,
  };
  // tạo ra một nhân viên mới
  static create = async (
    { username, email, password, role, department_id },
    createdBy
  ) => {
    // check Email exists
    const holderUser = await prisma.user.findFirst({ where: { email } });
    if (holderUser) {
      throw new BadRequestError("Error: User Already registered");
    }
    // Tìm role id
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        createdBy,
      },
    });
    if (newUser) {
      const role_data = await RoleService.findByName(role);
      const userProperty = await UserPropertyService.create({
        role_id: role_data.role_id,
        user_id: newUser.user_id,
        department_id,
      });
      return {
        code: 201,
      };
    }
    return {
      code: 200,
      data: null,
    };
  };
  static addUserIntoDepartment = async (listUserId, department_id) => {
    listUserId = listUserId.split(",");
    return await prisma.userProperty.updateMany({
      where: {
        OR: listUserId.map((user_id) => ({ user_id: user_id })),
      },
      data: {
        department_id,
      },
    });
  };
  static removeStaffFromDepartment = async (listUserId, department_id) => {
    listUserId = listUserId.split(",");
    return await prisma.userProperty.updateMany({
      where: {
        OR: listUserId.map((user_id) => ({ user_id: user_id })),
      },
      data: {
        department_id: null,
      },
    });
  };
  // get All Staff in department for Manager
  static getAllStaffInDepartment = async (
    { items_per_page, page, search, nextPage, previousPage, role = null },
    { department_id, manager_id },
    userId
  ) => {
    let query = [];
    let ListUserProperty;
    if (manager_id !== userId)
      throw new AuthFailureError(
        "Đây không phải phòng ban bạn của bạn, vui lòng rời đi."
      );
    if (role) {
      const role_data = await RoleService.findByName(role);
      ListUserProperty = await prisma.userProperty.findMany({
        where: { department_id, role_id: role_data.role_id },
      });
    } else {
      ListUserProperty = await prisma.userProperty.findMany({
        where: { department_id },
      });
    }
    query.push({
      user_id: {
        in: ListUserProperty.map((user) => user.user_id),
      },
    });
    query.push({
      deletedMark: false,
    });
    return await this.queryUser({
      query: query,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  // get All Staff in department for ADMIN
  static getAllStaffInDepartmentForAdmin = async (
    { items_per_page, page, search, nextPage, previousPage, role = null },
    department_id
  ) => {
    let query = [];
    let ListUserProperty;
    if (role) {
      const role_data = await RoleService.findByName(role);
      ListUserProperty = await prisma.userProperty.findMany({
        where: { department_id, role_id: role_data.role_id },
      });
    } else {
      ListUserProperty = await prisma.userProperty.findMany({
        where: { department_id },
      });
    }
    query.push({
      user_id: {
        in: ListUserProperty.map((user) => user.user_id),
      },
    });
    query.push({
      deletedMark: false,
    });
    return await this.queryUser({
      query: query,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  static getAllStaffByUserProperty = async (user_property_ids) => {
    console.log(user_property_ids);
    let query = [];
    query.push({
      UserProperty: {
        user_property_id: {
          in: user_property_ids,
        },
      },
    });
    console.log({
      UserProperty: {
        user_property_id: {
          in: user_property_ids,
        },
      },
    });
    query.push({
      deletedMark: false,
    });
    return await this.queryUser({
      query: query,
      getAll: true,
    });
  };
  // get all staffs
  static getAll = async ({
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
    role = null,
  }) => {
    let query = [];
    if (role) {
      const role_data = await RoleService.findByName(role);
      const users = await UserProperty.findUserByRole(role_data.role_id);
      query.push({
        user_id: {
          in: users.map((user) => user.user_id),
        },
      });
    }
    query.push({
      deletedMark: false,
    });
    return await this.queryUser({
      query: query,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  // get all staffs has been delete
  static trash = async ({
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
  }) => {
    const query = [
      {
        deletedMark: true,
      },
    ];
    return await this.queryUser({
      query: query,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  // staff information
  static detail = async (id) => {
    return await prisma.user.findUnique({
      where: { user_id: id },
      select: this.select,
    });
  };
  static detailUser = async (id) => {
    return await prisma.user.findUnique({
      where: { user_id: id },
      select: this.select,
    });
  };
  // staff information for admin
  static information = async (id) => {
    return await prisma.user.findUnique({
      where: { user_id: id },
      select: this.select,
    });
  };
  // Cập nhật nhân viên
  static update = async ({ id, data }) => {
    if (data.avatar) {
      try {
        return await prisma.user.update({
          where: { user_id: id },
          data,
          select: this.select,
        });
      } catch (errr) {
        cloudinary.uploader.destroy(data.avatar);
        throw new BadRequestError(
          "Cập nhật không thành công, vui lòng thử lại."
        );
      }
    }
    return await prisma.user.update({
      where: { user_id: id },
      data,
      select: this.select,
    });
  };
  static updateStaff = async ({ id, data }) => {
    return await prisma.user.update({
      where: { user_id: id },
      data,
      select: this.select,
    });
  };
  // Xoá nhân viên
  static delete = async (user_id) => {
    return await prisma.user.update({
      where: { user_id },
      select: this.select,
      data: {
        deletedMark: true,
        deletedAt: new Date(),
      },
    });
  };
  // Khôi phục lại nhân viên
  static restore = async (user_id) => {
    return await prisma.user.update({
      where: { user_id },
      select: this.select,
      data: {
        deletedMark: false,
      },
    });
  };
  // get Avatar by public id
  static getAvatar = async (avatar) => {
    // Return colors in the response
    const options = {
      height: 100,
      width: 100,
      format: "jpg",
    };
    try {
      const result = await cloudinary.url(avatar, options);
      return result;
    } catch (error) {
      console.error(error);
    }
  };
  // delete avatar in cloud
  static deleteAvatarInCloud = async (avatar, user_id) => {
    // Return colors in the response
    prisma.user.update({ where: { user_id }, data: { avatar: null } });
    return await cloudinary.uploader.destroy(avatar);
  };
  // Tìm người dùng bằng email
  static findByEmail = async (email) => {
    return await prisma.user.findFirst({
      where: { email },
      include: { UserProperty: { include: { role: true } } },
    });
  };
  static queryUser = async ({
    query,
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
    getAll,
  }) => {
    let itemsPerPage = Number(items_per_page) || 10;
    const currentPage = Number(page) || 1;
    const searchKeyword = search || "";
    let whereClause = {
      OR: [
        {
          username: {
            contains: searchKeyword,
          },
        },
        {
          email: {
            contains: searchKeyword,
          },
        },
      ],
    };
    if (query && query.length > 0) {
      whereClause.AND = query;
    }
    const total = await prisma.user.count({
      where: whereClause,
    });
    if (getAll) itemsPerPage = total;
    const skip = currentPage > 1 ? (currentPage - 1) * itemsPerPage : 0;

    const users = await prisma.user.findMany({
      take: itemsPerPage,
      skip,
      select: this.select,
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    const lastPage = Math.ceil(total / itemsPerPage);
    const nextPageNumber = currentPage + 1 > lastPage ? null : currentPage + 1;
    const previousPageNumber = currentPage - 1 < 1 ? null : currentPage - 1;

    return {
      users: users,
      total,
      nextPage: nextPageNumber,
      previousPage: previousPageNumber,
      currentPage,
      itemsPerPage,
    };
  };
}
module.exports = UserService;
