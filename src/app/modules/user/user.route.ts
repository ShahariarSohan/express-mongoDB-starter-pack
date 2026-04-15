import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import authGuard from "../../middlewares/authGuard";
import { UserRole } from "../../interfaces/userRole";
import { upload } from "../../config/multerCloudinary";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.registerUser,
);

router.get(
  "/me",
  authGuard(
    UserRole.ADMIN,
    UserRole.STUDENT,
    UserRole.VENDOR,
    UserRole.LANDLORD,
    UserRole.EVENT_ORGANISER,
    UserRole.SERVICE_PROVIDER
  ),
  userController.getMe
);

router.patch(
  "/updateMe",
  authGuard(
    UserRole.STUDENT,
    UserRole.VENDOR,
    UserRole.LANDLORD,
    UserRole.EVENT_ORGANISER,
    UserRole.SERVICE_PROVIDER
  ),
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateRequest(updateUserZodSchema),
  userController.updateMe
);

router.get(
  "/",
  authGuard(UserRole.ADMIN),
  userController.getAllUsers
);

router.get(
  "/:id",
  authGuard(UserRole.ADMIN),
  userController.getSingleUserById
);

export const userRoutes = router;
