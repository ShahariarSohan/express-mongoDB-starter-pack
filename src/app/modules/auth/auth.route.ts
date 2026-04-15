import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { changePassword, forgotPassword, loginZodSchema, verifyOtp } from "./auth.validation";
import authGuard from "../../middlewares/authGuard";
import { UserRole } from "../../interfaces/userRole";

const router = Router();

router.post("/login",validateRequest(loginZodSchema), authController.loginUser);
router.post("/logout", authController.logoutUser);

router.post(
  "/verify-otp",
  validateRequest(verifyOtp),
  authController.verifyOtp,
);
router.post(
  "/forget-password",
  validateRequest(forgotPassword),
  authController.forgetPasswordController,
);
router.post("/reset-otp-verify", authController.resetOtpVerifyController);

router.post(
  "/resend-otp",
  validateRequest(verifyOtp),
  authController.resendOtpController,
);

router.post("/reset-password", authController.resetPasswordController);
router.post("/change-password", authGuard(UserRole.ADMIN, UserRole.STUDENT, UserRole.VENDOR, UserRole.LANDLORD, UserRole.EVENT_ORGANISER, UserRole.SERVICE_PROVIDER),validateRequest(changePassword), authController.changePassword);

router.post("/social", authController.socialLoginController);
export const authRoutes = router;