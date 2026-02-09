import type { TicketPrefix } from "../types/ticket";

export const formatTicketId = ( prefix: TicketPrefix, number: number ) => {
    return `${ prefix }${ String(number).padStart( 3, "0" ) }`;
}