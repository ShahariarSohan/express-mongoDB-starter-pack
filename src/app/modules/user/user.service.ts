import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status";
import { paginationHelper } from "../../shared/paginationHelper";
import { userSearchableFields } from "./user.constant";

const registerUser = async (payload: any) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // Map fields to match schema.prisma
  const userData = {
    ...payload,
    password: hashedPassword,
    // Ensure legal timestamps are handled if they come as strings
    tcAcceptedAt: payload.tcAcceptedAt ? new Date(payload.tcAcceptedAt) : new Date(),
    privacyAcceptedAt: payload.privacyAcceptedAt ? new Date(payload.privacyAcceptedAt) : new Date(),
  };

  const result = await prisma.user.create({
    data: userData,
  });

  const { password, ...userWithoutPassword } = result as any;
  return userWithoutPassword;
};

const getMe = async (decodedUser: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedUser.email,
    },
  });

  const { password, ...userWithoutPassword } = userData as any;
  return userWithoutPassword;
};

const updateMe = async (userId: string, payload: any) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
  });
};

const getAllUsers = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filterData.verified !== undefined) {
    filterData.verified = filterData.verified === "true" || filterData.verified === true;
  }
  if (filterData.isStudent !== undefined) {
    filterData.isStudent = filterData.isStudent === "true" || filterData.isStudent === true;
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  const usersWithoutPassword = result.map((user) => {
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: usersWithoutPassword,
  };
};

const getSingleUserById = async (id: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: { id }
  });
  const { password, ...userWithoutPassword } = userData as any;
  return userWithoutPassword;
};

export const userService = {
  registerUser,
  getMe,
  updateMe,
  getAllUsers,
  getSingleUserById
};
