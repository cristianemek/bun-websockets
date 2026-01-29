import type { ClientMovePayload, ClientRegisterPayload } from '../schemas/websocket-message.schema';
import { ClientStore } from '../store/client.store';
import type { ClientMarker } from '../types';
import { generateUuid } from '../utils/generate-uuid';

class ClientsService {
  private readonly clientsStore: ClientStore;

  constructor() {
    this.clientsStore = new ClientStore();
  }

  getAllClients() {
    return this.clientsStore.getAll();
  }

  registerClient(input: ClientRegisterPayload): ClientMarker | { error: string } {
    if (this.clientsStore.has(input.clientId)) {
        return { error: 'Client ID already exists' };
    }
    const client: ClientMarker = {
        ...input,
        updatedAt: Date.now(),
        color: input.color || 'gray'
    }

    this.clientsStore.add(client);
    return client;
  }

  ClientMoved(clientId: string, input: ClientMovePayload): ClientMarker | { error: string } {
    const client = this.clientsStore.getById(clientId);
    if (!client) {
      return { error: 'Client not found' };
    }

    const updatedClient = this.clientsStore.updateCoords(clientId, input.coords);

    if (!updatedClient) {
      return { error: 'Failed to update client coordinates' };
    }

    return updatedClient;
  }

  removeClient(clientId: string) {
    return this.clientsStore.remove(clientId);
  }
}

export const clientsService = new ClientsService();