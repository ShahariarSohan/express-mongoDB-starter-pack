import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { chatService } from "./chat.service";
import httpStatus from "http-status";

const sendMessage = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { conversationId, content } = req.body;
  const result = await chatService.sendMessage(req.user.id, conversationId, content);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message sent",
    data: result,
  });
});

const getConversations = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await chatService.getConversations(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversations retrieved",
    data: result,
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await chatService.getMessages(req.params.conversationId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages retrieved",
    data: result,
  });
});

const getOrCreateConversation = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { participantId } = req.body;
  const participantIds = [req.user.id, participantId].sort();
  const result = await chatService.getOrCreateConversation(participantIds);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversation retrieved/created",
    data: result,
  });
});

export const chatController = {
  sendMessage,
  getConversations,
  getMessages,
  getOrCreateConversation,
};
