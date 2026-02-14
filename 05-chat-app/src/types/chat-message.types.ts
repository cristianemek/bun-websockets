

export interface ChatMessage {
    id: string;
    groupId?: string;
    receiverId?: string;
    senderId: Sender;
    content: string;
    createdAt: string;
}

export interface Sender {
    id: string;
    name: string;
    email: string;
}