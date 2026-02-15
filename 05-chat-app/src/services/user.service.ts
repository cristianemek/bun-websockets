import { prisma } from "../prisma/db";
import { ConnectedUsersStore } from "../store/connected-users.store";
import type { Sender } from "../types/chat-message.types";

class UserService {

  private connectedUsersStore = new ConnectedUsersStore();

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

  // usuarios conectados

  getConnectedUsers(): Sender[] {
    return this.connectedUsersStore.getUsers();
  }

  addConnectedUser(user: Sender): void {
    this.connectedUsersStore.addUser(user);
  }

  removeConnectedUser(userId: string): void {
    this.connectedUsersStore.removeUser(userId);
  }

}

export const userService = new UserService();
