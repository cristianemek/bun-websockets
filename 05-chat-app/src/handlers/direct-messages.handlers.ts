import { chatMessageService } from "../services/chat.message.service";
import { userService } from "../services/user.service";
import type { ServerMessage } from "../types";
import { createErrorMessage } from './error.handlers';



export const handleGetDirectMessages = async(receiverId: string, senderId: string): Promise<ServerMessage> => {

    const receiverUser = await userService.getSenderById(receiverId);

    //! no deberia pasar por este error ya que se valida cuando se establece la conexion, pero por si acaso lo dejo
    if (!receiverUser) {
        return createErrorMessage(`Receiver user with ID ${receiverId} not found.`);
    }


    try {
        const messages = await chatMessageService.getDirectMessages(senderId, receiverId);
        return {
            type: 'SEND_DIRECT_MESSAGES_RESPONSE',
            payload: {
                messages,
                receiverId,

            }
        }
    } catch (error) {
        console.error(`Error fetching direct messages between ${senderId} and ${receiverId}:`, error);
        return createErrorMessage('An error occurred while fetching direct messages. Please try again later.');
    }

}


interface SendDirectMessagePayload {
    content: string;
    receiverId: string;
    senderId: string;
}


export const handleDirectMessage = async(payload: SendDirectMessagePayload): Promise<ServerMessage> => {

    const { content, receiverId, senderId } = payload;
    
    try {
        const newMessage = await chatMessageService.sendDirectMessage(content, senderId, receiverId);
        return {
            type: 'SEND_DIRECT_MESSAGES_RESPONSE',
            payload: {
                messages: [newMessage],
                receiverId,
            }
        }
    } catch (error) {
        console.error(`Error sending direct message from ${senderId} to ${receiverId}:`, error);
        return createErrorMessage('An error occurred while sending the direct message. Please try again later.');
    }
}

