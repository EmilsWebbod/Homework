import {createContext, type PropsWithChildren, type ReactElement, useCallback, useState} from "react";
import type {Message, Participant} from "../../types/messages.js";

interface RTCContextProps {
    state: RTCState;
    setParticipants: (participants: Participant[]) => void;
    setMessages: (messages: Message[]) => void;
}

interface RTCState {
    participants: Participant[];
    messages: Message[];
}

export const RTCContext = createContext<RTCContextProps>({
    state: {
        participants: [],
        messages: []
    },
    setParticipants: (): void => {},
    setMessages: (): void => {},
})

export function RTCProvider({ children }: PropsWithChildren<object>): ReactElement {
    const [state, setState] = useState<RTCState>({
        participants: [],
        messages: []
    });

    const setParticipants = useCallback((participants: Participant[]): void => {
        setState(s => ({ ...s, participants}));
    },[])

    const setMessages = useCallback((message: Message[]): void => {
        setState(s => ({ ...s, message}));
    },[])

    return <RTCContext.Provider value={{ state, setParticipants, setMessages }}>
        {children}
    </RTCContext.Provider>
}
