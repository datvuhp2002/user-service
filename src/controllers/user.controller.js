"use strict";

const UserService = require("../services/user.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class UserController {
  create = async (req, res, next) => {
    console.log(req.headers.user);
    new CREATED({
      message: "Tạo nhân viên mới thành công",
      data: await UserService.create(req.body, req.headers.user),
    }).send(res);
  };
  findByEmail = async (req, res, next) => {
    new SuccessResponse({
      message: "Tìm email thành công",
      data: await UserService.findByEmail(req.params.email),
    }).send(res);
  };
  /**
   * @param {items_per_page}
   * @param {page}
   * @param {search}
   * @param {nextPage}
   * @param {previousPage}
   */
  getAll = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy ra danh sách người dùng thành công",
      data: await UserService.getAll(req.query),
    }).send(res);
  };
  getAllStaffInDepartment = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy ra danh sách người dùng thành công",
      data: await UserService.getAllStaffInDepartment(
        req.query,
        req.params.id,
        req.headers.user
      ),
    }).send(res);
  };
  getAllStaffInDepartmentForAdmin = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy ra danh sách người dùng thành công",
      data: await UserService.getAllStaffInDepartmentForAdmin(
        req.query,
        req.params.id
      ),
    }).send(res);
  };
  /**
   * @param {items_per_page}
   * @param {page}
   * @param {search}
   * @param {nextPage}
   * @param {previousPage}
   */
  trash = async (req, res, next) => {
    new SuccessResponse({
      message: "Lấy ra danh sách người dùng bị xoá thành công",
      data: await UserService.trash(req.query),
    }).send(res);
  };
  detail = async (req, res, next) => {
    new SuccessResponse({
      message: "Thông tin người dùng",
      data: await UserService.detail(req.headers.user),
    }).send(res);
  };
  detailUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Thông tin người dùng",
      data: await UserService.detailUser(req.params.id),
    }).send(res);
  };
  information = async (req, res, next) => {
    new SuccessResponse({
      message: "Thông tin người dùng",
      data: await UserService.detail(req.params.id),
    }).send(res);
  };
  update = async (req, res, next) => {
    new SuccessResponse({
      message: "Cập nhật nhân viên thành công",
      data: await UserService.update({ id: req.params.id, data: req.body }),
    }).send(res);
  };
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Xoá thành công nhân viên",
      data: await UserService.delete(req.params.id),
    }).send(res);
  };
  restore = async (req, res, next) => {
    new SuccessResponse({
      message: "Khôi phục thành công nhân viên",
      data: await UserService.restore(req.params.id),
    }).send(res);
  };
  /**
   * @param {ids} query
   * @param {:id} params departmentId
   */
  addUserIntoDepartment = async (req, res, next) => {
    new SuccessResponse({
      message: "Thêm thành công nhân viên vào phòng ban",
      data: await UserService.addUserIntoDepartment(
        req.query.ids,
        req.params.id,
        req.headers.user
      ),
    }).send(res);
  };
}

module.exports = new UserController();
