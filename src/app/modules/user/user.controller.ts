import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { userService } from "./user.service";
import pick from "../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { paginationTermArray } from "../../shared/paginationConstant";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getMe((req as any).user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateMe = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  let profileImage;
  let coverImage;

  if (req.files && (req.files as any).profileImage) {
    profileImage = (req.files as any).profileImage[0].path;
  }
  if (req.files && (req.files as any).coverImage) {
    coverImage = (req.files as any).coverImage[0].path;
  }

  const payload = {
    ...req.body,
    ...(profileImage && { profileImage }),
    ...(coverImage && { coverImage }),
  };

  const updatedUser = await userService.updateMe(req.user.id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, paginationTermArray);

  const result = await userService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getSingleUserById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

export const userController = {
  registerUser,
  getMe,
  updateMe,
  getAllUsers,
  getSingleUserById
};
