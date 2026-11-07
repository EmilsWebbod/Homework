
export interface PeerEvent<T extends string, V> {
    type: T;
    value: V;
}

export type ConnectEvent = PeerEvent<'connect', string>
export type DisconnectEvent = PeerEvent<'disconnect', string>
export type ChatEvent = PeerEvent<'chat', string>
export type EditEvent = PeerEvent<'edit', Pick<Message, 'id' | 'text'>>
export type ClientEvent = ConnectEvent | DisconnectEvent | ChatEvent | EditEvent;

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
