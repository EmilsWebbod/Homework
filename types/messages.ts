
export interface PeerEvent<T extends string, V> {
    type: T;
    value: V;
}

export type ConnectEvent = PeerEvent<'connect', string>
export type DisconnectEvent = PeerEvent<'disconnect', string>
export type ChatEvent = PeerEvent<'chat', string>
export type EditEvent = PeerEvent<'edit', Pick<Message, 'id' | 'text'>>
export type DeleteEvent = PeerEvent<'delete', string>
export type ClientEvent = ConnectEvent | DisconnectEvent | ChatEvent | EditEvent | DeleteEvent;

export interface Message {
    id: string;
    type: 'message' | 'joined' | 'left';
    text: string;
    participant: Participant;
    createdAt: string;
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
