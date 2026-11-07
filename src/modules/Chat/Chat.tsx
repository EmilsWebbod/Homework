import './Chat.css';
import {type ReactElement, useLayoutEffect, useRef} from "react";
import type {Message} from "../../../types/messages.js";
import {ChatInput, type ChatInputProps} from "./ChatInput.js";
import {ChatMessage, ChatStatus} from "./ChatMessage.js";

// How close (in px) to the bottom still counts as "at the bottom"
const BOTTOM_THRESHOLD = 32;

interface Props extends ChatInputProps {
    messages: Message[];
}

export function Chat({messages, onSend}: Props): ReactElement {
    const messagesRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);

    const handleOnScroll = (): void => {
        const el = messagesRef.current;
        if (!el) return;
        isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD;
    }

    // Scroll to the newest message, but only if the user was already at the bottom
    useLayoutEffect((): void => {
        const el = messagesRef.current;
        if (el && isAtBottomRef.current) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat">
            <div className="chat__messages" ref={messagesRef} onScroll={handleOnScroll}>
                {messages.map((message): ReactElement => {
                    switch (message.type) {
                        case "joined": return <ChatStatus key={message.id} message={message} status="joined" />
                        case "left": return <ChatStatus key={message.id} message={message} status="left" />
                        default: return <ChatMessage key={message.id} message={message}/>
                    }
                })}
            </div>
            <ChatInput onSend={onSend} />
        </div>
    )
}
