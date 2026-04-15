import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { jwtHelpers } from "./jwtHelpers";
import { envVariables } from "../config/env";
import { prisma } from "../config/prisma";



const OTPVerify = async (payload: {
  otp: number;
  token?: string;
  email?: string;
  time: string;
}) => {
  let decoded: JwtPayload = {};
  if (payload.token && !payload.email) {
    try {
      if (!payload.token) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Token is required");
      }
      decoded = jwtHelpers.verifyToken(payload?.token, envVariables.ACCESS_TOKEN_SECRET as Secret);
    } catch (error) {
      throw new AppError(StatusCodes.CONFLICT, "Invalid or expired token");
    }
  }

  // Find user by email
  const findUser = await prisma.user.findUnique({
    where: {
      email: decoded.email || payload.email,
    },
  });

  if (!findUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Find OTP record
  const otpRecord = await prisma.otp.findUnique({
    where: {
      email: decoded.email || payload.email,
    },
    select: {
      otp: true,
      expiry: true,
    },
  });

  if (!otpRecord) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "OTP not found");
  }

  // Check if OTP is expired (valid for 5 minutes)
  const currentTime = new Date();
  const otpExpiryTime = otpRecord.expiry && (new Date(otpRecord.expiry) as any);

  if (currentTime > otpExpiryTime) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP expired");
  }

  // Verify OTP
  if (otpRecord && String(otpRecord.otp) !== String(payload.otp)) {
    throw new AppError(StatusCodes.CONFLICT, "Invalid OTP");
  }

  // Generate new token after successful verification
  const newToken = jwtHelpers.generateToken(
    { email: findUser.email, id: findUser.id, role: findUser.role },
    envVariables.ACCESS_TOKEN_SECRET as Secret,
    envVariables.ACCESS_TOKEN_EXPIRES_IN as string
  );

  await prisma.otp.delete({
    where: {
      email: decoded.email || payload.email,
    },
  });

  const result = {
    message: "OTP verified successfully",
    accessToken: newToken,
  };

  return result;
};

export default OTPVerify;
