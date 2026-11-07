
export interface PeerEvent<T extends string> {
    type: T;
    value: string;
}

export type ConnectEvent = PeerEvent<'connect'>
export type DisconnectEvent = PeerEvent<'disconnect'>
export type ChatEvent = PeerEvent<'chat'>
export type ClientEvent = ConnectEvent | DisconnectEvent | ChatEvent;

export interface Message {
    id: string;
    text: string;
    participant: Participant;
}

export interface Participant {
    id: string;
    name: string;
}

interface DataEvent<T extends string, D extends object> {
    type: T;
    data: D[];
}

export type ParticipantsEvent = DataEvent<'participants', Participant>;
export type MessagesEvent = DataEvent<'messages', Message>;
export type ServerEvent = ParticipantsEvent | MessagesEvent;
