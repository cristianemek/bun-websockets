import { ms } from "zod/locales";
import { SERVER_CONFIG } from "../config/server-config";
import { prisma } from "../prisma/db";
import type { ChatMessage } from "../types/chat-message.types";

class ChatMessageService {
  //! Mensajes grupales
  async sendGroupMessage(
    content: string,
    senderId: string,
    groupId?: string,
  ): Promise<ChatMessage> {
    if (!groupId) {
      const defaultGroup = await prisma.group.findFirst({
        where: {
          //* lo ideal en producción sería tener un ID fijo para el canal general, pero por simplicidad lo busco por nombre
          name: SERVER_CONFIG.defaultChannelName,
        },
      });
      if (!defaultGroup) {
        throw new Error("Default group not found");
      }
      groupId = defaultGroup.id;
    }

    const sender = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      throw new Error("Sender not found");
    }

    const groupMessage = await prisma.groupMessage.create({
      data: {
        content,
        senderId,
        groupId,
      },
    });

    return {
      id: groupMessage.id,
      content: content,
      createdAt: groupMessage.createdAt.getTime(),
      groupId: groupId,
      sender: {
        id: senderId,
        name: sender.name,
        email: sender.email,
      },
    };
  }

  async getGroupMessages(groupId: string): Promise<ChatMessage[]> {
    const messages = await prisma.groupMessage.findMany({
      where: {
        groupId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });

    return messages.map((msg) => ({
      id: msg.id,
      groupId: groupId,
      content: msg.content,
      createdAt: msg.createdAt.getTime(),
      sender: {
        id: msg.sender.id,
        name: msg.sender.name,
        email: msg.sender.email,
      },
    }));
  }

  //! Mensajes privados
}

export const chatMessageService = new ChatMessageService();