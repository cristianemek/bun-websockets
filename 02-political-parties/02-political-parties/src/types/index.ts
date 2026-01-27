
export interface PoliticalParty{
    id: string;
    name: string;
    votes: number;
    color: string;
    borderColor: string;
}

export interface WebSocketMessage{
    type: MessageType;
    payload: unknown;
}

//todo mesagge payload

export type MessageType = 'GET_PARTIES' | 'ADD_PARTY' | 'UPDATE_PARTY'| 'DELETE_PARTY' | 'INCREMENT_VOTES' | 'DECREMENT_VOTES';

export interface WebSocketResponse{
    type: ResponseType;
    payload: unknown;
}

export type ResponseType = 'PARTIES_LIST' | 'PARTY_ADDED' | 'PARTY_UPDATED'| 'PARTY_DELETED' | 'VOTES_UPDATED' | 'ERROR';
//TODO: payload

export interface WebSocketData{
    clientId: string;
}