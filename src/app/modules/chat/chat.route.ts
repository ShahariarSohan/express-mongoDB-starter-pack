import express from "express";
import authGuard from "../../middlewares/authGuard";
import { UserRole } from "../../interfaces/userRole";
import { chatController } from "./chat.controller";

const router = express.Router();

router.get("/conversations", authGuard(UserRole.USER), chatController.getConversations);
router.get("/messages/:conversationId", authGuard(UserRole.USER), chatController.getMessages);
router.post("/send", authGuard(UserRole.USER), chatController.sendMessage);
router.post("/get-or-create", authGuard(UserRole.USER), chatController.getOrCreateConversation);

export const chatRoutes = router;
