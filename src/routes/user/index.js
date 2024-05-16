"use strict";
const express = require("express");
const UserController = require("../../controllers/user.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { upload } = require("../../middleware");
const router = express.Router();

// Tìm người dùng bằng email
router.get("/findByEmail/:email", asyncHandler(UserController.findByEmail));
// Lấy ra hết tất cả user
router.get("/admin/getAll", asyncHandler(UserController.getAll));
// get all user in department
router.get(
  "/getAllStaffInDepartment",
  asyncHandler(UserController.getAllStaffInDepartment)
);
router.get(
  "/admin/getAllStaffInDepartment/:id",
  asyncHandler(UserController.getAllStaffInDepartmentForAdmin)
);
// Lấy ra hết tất cả user đã bị xoá
router.get("/admin/trash", asyncHandler(UserController.trash));
// Tạo ra một người dùng mới
router.post("/create", asyncHandler(UserController.create));
router.post(
  "/getAllStaffByUserProperty",
  asyncHandler(UserController.getAllStaffByUserProperty)
);
// Upload Avatar
router.post(
  "/uploadAvatarFromUrl",
  asyncHandler(UserController.uploadImageFromUrl)
);
router.post(
  "/uploadAvatarFromLocal",
  upload.single("file"),
  asyncHandler(UserController.uploadFileAvatarFromLocal)
);
router.post("/getAvatar", asyncHandler(UserController.getAvatar));
router.post(
  "/deleteAvatarInCloud",
  asyncHandler(UserController.deleteAvatarInCloud)
);

// update account information
router.put("/update", asyncHandler(UserController.update));

// update staff account information (ADMIN only)
router.put("/admin/update/:id", asyncHandler(UserController.updateStaff));

// GET account information
router.get("/detail", asyncHandler(UserController.detail));
// GET staff account information (ADMIN only)
router.get("/admin/detail/:id", asyncHandler(UserController.detailUser));
// Xoá một người dùng theo id
router.delete("/admin/delete/:id", asyncHandler(UserController.delete));
// Khôi phục một người dùng đã bị xoá
router.put("/admin/restore/:id", asyncHandler(UserController.restore));

router.post(
  "/addUserIntoDepartment/:id",
  asyncHandler(UserController.addUserIntoDepartment)
);
router.post(
  "/removeStaffFromDepartment/:id",
  asyncHandler(UserController.removeStaffFromDepartment)
);
module.exports = router;
