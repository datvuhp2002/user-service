"use strict";

const { getInfoData } = require("../utils");
const prisma = require("../prisma");
const RoleService = require("./role.service");
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
    console.log(createdBy);
    console.log(username);
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
  // get All Staff in department for Manager
  static getAllStaffInDepartment = async (
    { items_per_page, page, search, nextPage, previousPage },
    department_id,
    userId
  ) => {
    const ListUserProperty = await prisma.userProperty
      .findMany({
        where: { department_id },
        select: { user_id: true },
      })
      .then((data) => data.map((item) => item.user_id));
    const isYourDepartment = ListUserProperty.some((user) => user === userId);
    if (!isYourDepartment)
      throw new AuthFailureError(
        "Đây không phải phòng ban bạn của bạn, vui lòng rời đi."
      );
    const query = ListUserProperty.map((user_id) => ({ user_id: user_id }));
    return await this.queryUser({
      query: query,
      condition: false,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  static getAllStaffInDepartmentForAdmin = async (
    { items_per_page, page, search, nextPage, previousPage },
    department_id
  ) => {
    const ListUserProperty = await prisma.userProperty
      .findMany({
        where: { department_id },
        select: { user_id: true },
      })
      .then((data) => data.map((item) => item.user_id));
    const query = ListUserProperty.map((user_id) => ({ user_id: user_id }));
    return await this.queryUser({
      query: query,
      condition: false,
      items_per_page,
      page,
      search,
      nextPage,
      previousPage,
    });
  };
  // Lấy ra tất cả nhân viên
  static getAll = async ({
    items_per_page,
    page,
    search,
    nextPage,
    previousPage,
  }) => {
    const query = [
      {
        deletedMark: false,
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
  // Lấy ra tất cả nhân viên đã bị xoá
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
    console.log(id);
    return await prisma.user.findUnique({
      where: { user_id: id },
      select: this.select,
    });
  };
  static detailUser = async (id) => {
    console.log(id);
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
  static getAvatar = async (avatar) => {
    // Return colors in the response
    const options = {
      height: 100,
      width: 100,
      format: "jpg",
    };
    try {
      const result = await cloudinary.url(avatar, options);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  };
  static deleteAvatarInCloud = async (avatar, user_id) => {
    // Return colors in the response
    prisma.user.update({ where: { user_id }, data: { avatar: null } });
    return await cloudinary.uploader.destroy(avatar);
  };
  // Tìm người dùng bằng email
  static findByEmail = async (email) => {
    console.log(email);
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
  }) => {
    console.log(query);
    const itemsPerPage = Number(items_per_page) || 10;
    const currentPage = Number(page) || 1;
    const searchKeyword = search || "";
    const skip = currentPage > 1 ? (currentPage - 1) * itemsPerPage : 0;
    const users = await prisma.user.findMany({
      take: itemsPerPage,
      skip,
      select: this.select,
      where: {
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
        OR: query,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await prisma.user.count({
      where: {
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
        OR: query,
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
