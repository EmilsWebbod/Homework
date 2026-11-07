import {createContext, type PropsWithChildren, type ReactElement, useCallback, useState} from "react";
import type {Message, Participant, ServerEvent} from "../../types/messages.js";

interface RTCContextProps {
    state: RTCState;
    onRTCEvent: (event: ServerEvent) => void;
}

interface RTCState {
    me: Participant | null;
    participants: Participant[];
    messages: Message[];
}

export const RTCContext = createContext<RTCContextProps>({
    state: {
        me: null,
        participants: [],
        messages: []
    },
    onRTCEvent: (): void => {
    },
})

export function RTCProvider({ children }: PropsWithChildren<object>): ReactElement {
    const [state, setState] = useState<RTCState>({
        me: null,
        participants: [],
        messages: []
    });

    const onRTCEvent = useCallback((event: ServerEvent): void => {
        switch (event.type) {
            case 'connected': {
                setState(s => ({...s, me: event.data}));
                break;
            }
            case "participants": {
                setState(s => ({...s, participants: event.data}));
                break;
            }
            case 'messages': {
                setState(s => ({...s, messages: event.data}));
                break;
            }
        }
    }, [])

    return <RTCContext.Provider value={{state, onRTCEvent}}>
        {children}
    </RTCContext.Provider>
}
