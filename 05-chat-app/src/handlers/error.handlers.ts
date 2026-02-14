import type { HandleResult, ServerMessage } from "../types";


export const createErrorMessage = (error: string): ServerMessage => {

    return{
        type: 'ERROR',
        payload: {error: error}
    }
}

export const createErrorResponse = (error: string): HandleResult => {
    return {
        broadcast: [],
        personal: [createErrorMessage(error)]
    }
}
