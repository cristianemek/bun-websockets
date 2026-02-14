import { prisma } from "../prisma/db";
import type { Sender } from "../types/chat-message.types";

class UserService {
  //todo connected users

  async getSenderById(userId: string): Promise<Sender | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export const userService = new UserService();
