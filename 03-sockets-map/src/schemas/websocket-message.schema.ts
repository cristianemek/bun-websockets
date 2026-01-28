import { z } from 'zod';

const latLngSchema = z.object({
  lat: z.number('Latitude is required'),
  lng: z.number('Longitude is required'),
});

export const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('GET_CLIENTS'),
    payload: z.undefined().optional(),
  }),
  z.object({
    type: z.literal('CLIENT_REGISTER'),
    payload: z.object({
      clientId: z.string('Client ID is required').min(1, 'Client ID cannot be empty'),
      name: z.string('Name is required').min(1, 'Name cannot be empty'),
      color: z.string('Color is required').min(1, 'Color cannot be empty').optional(),
      coords: latLngSchema,
    }),
  }),
  z.object({
    type: z.literal('CLIENT_MOVE'),
    payload: z.object({
      clientId: z.string('Client ID is required').min(1, 'Client ID cannot be empty'),
      coords: latLngSchema,
    }),
  }),
]);

// const typeSchema = z.enum([
//   'GET_ITEMS',
//   'ADD_ITEM',
//   'UPDATE_ITEM',
//   'DELETE_ITEM',
// ]);

// const payloadSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().optional(),
// });

// export const messageSchema = z.object({
//   type: typeSchema,
//   payload: payloadSchema.optional(),
// });

export type MessageParsed = z.infer<typeof messageSchema>;

export type ClientRegisterPayload = Extract<
  MessageParsed,
  { type: 'CLIENT_REGISTER' }
>['payload'];

export type ClientMovePayload = Extract<
  MessageParsed,
  { type: 'CLIENT_MOVE' }
>['payload'];

export type GetClientsPayload = Extract<
  MessageParsed,
  { type: 'GET_CLIENTS' }
>['payload'];