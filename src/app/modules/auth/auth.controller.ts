/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { Request, Response } from "express";

import sendResponse from "../../shared/sendResponse";
import { envVariables } from "../../config/env";
import { parseExpiryToken } from "../../shared/parseExpiryToken";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
// auth.controller.ts
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const accessTokenMaxAge = parseExpiryToken(
    envVariables.ACCESS_TOKEN_EXPIRES_IN as string,
    1000 * 60 * 60
  );
  const refreshTokenMaxAge = parseExpiryToken(
    envVariables.REFRESH_TOKEN_EXPIRES_IN as string,
    1000 * 60 * 60 * 24 * 30
  );

  const result = await authService.loginUser(req.body);
  const { refreshToken, accessToken } = result;
  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: accessTokenMaxAge,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: refreshTokenMaxAge,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      accessToken,
      refreshToken,
    },
  });
});
const logoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear cookies
  res.clearCookie("accessToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully!",
    data: null,
  });
})
const verifyOtp = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const body = req.body as any;
  const result = await authService.verifyOtp(body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP verified successfully",
    data: result,
  });
});

const forgetPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body;
    const result = await authService.forgetPassword(body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "OTP sent to your email",
      data: result,
    });
  },
);

const resetOtpVerifyController = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body;
    const result = await authService.resetOtpVerify(body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "OTP verified successfully",
      data: result,
    });
  },
);

const resendOtpController = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await authService.resendOtp(body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP sent to your email",
    data: result,
  });
});

const socialLoginController = catchAsync(
  async (req: Request, res: Response) => {
    const accessTokenMaxAge = parseExpiryToken(
      envVariables.ACCESS_TOKEN_EXPIRES_IN as string,
      1000 * 60 * 60
    );
    const refreshTokenMaxAge = parseExpiryToken(
      envVariables.REFRESH_TOKEN_EXPIRES_IN as string,
      1000 * 60 * 60 * 24 * 30
    );

    const result = await authService.socialLogin(req.body);
    const { refreshToken, accessToken } = result;

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: accessTokenMaxAge,
    });
    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: refreshTokenMaxAge,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User login successfully",
      data: result,
    });
  },
);

const resetPasswordController = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const decodedToken = req.user;
    const { newPassword } = req.body;
    const result = await authService.resetPassword(
      newPassword,
      decodedToken as JwtPayload,
    );
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Reset password successfully",
      data: result,
    });
  },
);
const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const decodedToken = req.user;
    const {currentPassword,newPassword} = req.body;
    await authService.changePassword(
      currentPassword,
      newPassword,
      decodedToken as JwtPayload,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Password Changed Successfully",
      data: null,
    });
  },
);
export const authController = {
  loginUser,
  logoutUser,
  verifyOtp,
  forgetPasswordController,
  resetOtpVerifyController,
  resendOtpController,
  socialLoginController,
  resetPasswordController,
  changePassword
};
