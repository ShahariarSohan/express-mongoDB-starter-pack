/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import { jwtHelpers } from "../../utils/jwtHelpers";

import { JwtPayload, Secret } from "jsonwebtoken";

import AppError from "../../errorHelpers/AppError";
import { envVariables } from "../../config/env";

// auth.service.ts

import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";


import { StatusCodes } from "http-status-codes";
import { OTPFn } from "../../utils/OTPFn";
import OTPVerify from "../../utils/OTPVerify";
import { UserRole } from "../../interfaces/userRole";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid user or email");
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    envVariables.ACCESS_TOKEN_SECRET as Secret,
    envVariables.ACCESS_TOKEN_EXPIRES_IN as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    envVariables.REFRESH_TOKEN_SECRET as Secret,
    envVariables.REFRESH_TOKEN_EXPIRES_IN as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const verifyOtp = async (payload: { email: string; otp: number }) => {
  const { message } = await OTPVerify({ ...payload, time: "24h" });

  if (message) {
    const updateUserInfo = await prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updateUserInfo;
  }
};

const forgetPassword = async (payload: { email: string }) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!findUser) {
    throw new Error("User not found");
  }

  OTPFn(findUser.email);
  return;
};

const resetOtpVerify = async (payload: { email: string; otp: number }) => {
  const { accessToken } = await OTPVerify({ ...payload, time: "1h" });

  return accessToken;
};

const resendOtp = async (payload: { email: string }) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!findUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  OTPFn(findUser.email);
};

const socialLogin = async (payload: {
  email: string;
  name: string;
  profileImage?: string;
}) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email.trim(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (userData) {
    const accessToken = jwtHelpers.generateToken(
      { id: userData.id, email: userData.email, role: UserRole.GENERAL },
      envVariables.ACCESS_TOKEN_SECRET as Secret,
      envVariables.ACCESS_TOKEN_EXPIRES_IN as string,
    );

    const refreshToken = jwtHelpers.generateToken(
      { email: userData.email, role: UserRole.GENERAL },
      envVariables.REFRESH_TOKEN_SECRET as Secret,
      envVariables.REFRESH_TOKEN_EXPIRES_IN as string,
    );
const userInfo={...userData,role:UserRole.GENERAL}
    return {
      ...userInfo,
      accessToken,
      refreshToken,
    };
  } else {
    const result = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: "",
        role: UserRole.GENERAL,
        isVerified: true,
        tcAcceptedAt: new Date(),
        privacyAcceptedAt: new Date(),
        country: "N/A", // Defaulting since it's required in schema
        city: "N/A", // Defaulting since it's required in schema
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const accessToken = jwtHelpers.generateToken(
      { id: result.id, email: result.email, role: result.role },
      envVariables.ACCESS_TOKEN_SECRET as Secret,
      envVariables.ACCESS_TOKEN_EXPIRES_IN as string,
    );

    const refreshToken = jwtHelpers.generateToken(
      { email: result.email, role: result.role },
      envVariables.REFRESH_TOKEN_SECRET as Secret,
      envVariables.REFRESH_TOKEN_EXPIRES_IN as string,
    );

    return {
      ...result,
      accessToken,
      refreshToken,
    };
  }
};

const resetPassword = async (newPassword: string, decodedToken: JwtPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: decodedToken.email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "No user exist");
  }
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(envVariables.BCRYPT_SALT_ROUND),
  );

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashPassword,
    },
  });
  return result;
};
const changePassword = async (
  currentPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  let user = await prisma.user.findUnique({
    where: {
      email: decodedToken.email,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "No user exist");
  }
  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password as string,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password doesn't match");
  }
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(envVariables.BCRYPT_SALT_ROUND),
  );
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return true;
};

export const authService = {
  loginUser,
  forgetPassword,
  verifyOtp,
  resendOtp,
  socialLogin,
  resetOtpVerify,
  resetPassword,
  changePassword,
};
