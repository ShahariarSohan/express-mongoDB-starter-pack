import { prisma } from "../../config/prisma";
import { getIO } from "../../utils/socket";

const sendMessage = async (senderId: string, conversationId: string, content: string) => {
  const message = await prisma.message.create({
    data: {
      content,
      senderId,
      conversationId,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  // Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Emit to socket room
  const io = getIO();
  if (io) {
    io.to(conversationId).emit("new_message", message);
  }

  return message;
};

const getConversations = async (userId: string) => {
  return await prisma.conversation.findMany({
    where: {
      participantIds: { has: userId },
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

const getMessages = async (conversationId: string) => {
  return await prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

const getOrCreateConversation = async (participantIds: string[]) => {
  // Find existing conversation with exactly these participants
  const existing = await prisma.conversation.findFirst({
    where: {
      participantIds: { equals: participantIds },
    },
  });

  if (existing) return existing;

  // Create new
  const conversation = await prisma.conversation.create({
    data: {
      participantIds,
      participants: {
        connect: participantIds.map((id) => ({ id })),
      },
    },
  });

  return conversation;
};

export const chatService = {
  sendMessage,
  getConversations,
  getMessages,
  getOrCreateConversation,
};
