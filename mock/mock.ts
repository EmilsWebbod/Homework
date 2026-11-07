import {MessagesEvent, ParticipantsEvent} from "../types/messages.js";
import {mockMessages} from "./mock.messages.js";
import {mockParticipants} from "./mock.participants.js";

export { mockMessages, mockParticipants };

// Server-style snapshot events, matching ServerEvent in messages.ts
export const mockParticipantsEvent: ParticipantsEvent = {
    type: 'participants',
    data: mockParticipants,
};

export const mockMessagesEvent: MessagesEvent = {
    type: 'messages',
    data: mockMessages,
};
