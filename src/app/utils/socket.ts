import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { envVariables } from "../config/env";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: envVariables.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("⚡ New user connected:", socket.id);

    socket.on("join_conversation", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`👤 User ${socket.id} joined conversation: ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    // Return null instead of throwing to avoid crashing on Serverless environments
    console.warn("⚠️ getIO() called before initialization.");
    return null;
  }
  return io;
};
