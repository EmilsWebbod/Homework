import './Chat.css';
import {type ReactElement, useLayoutEffect, useRef, useState} from "react";
import type {EditEvent, Message, Participant} from "../../../types/messages.js";
import {ChatInput, type ChatInputProps} from "./ChatInput.js";
import {ChatMessage, ChatStatus} from "./ChatMessage.js";

// How close (in px) to the bottom still counts as "at the bottom"
const BOTTOM_THRESHOLD = 32;

interface Props extends ChatInputProps {
    messages: Message[];
    me: Participant | null;
    onEdit: (message: EditEvent['value']) => void;
    onDelete: (id: string) => void;
}

export function Chat({messages, me, onSend, onEdit, onDelete}: Props): ReactElement {
    const messagesRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);
    const [editing, setEditing] = useState<Message | null>(null);

    const handleOnDelete = (id: string): void => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        onDelete(id);
        // Stop editing if the deleted message was the one being edited
        if (editing?.id === id) setEditing(null);
    }

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
                        default: return (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isOwn={!!me && message.participant.id === me.id}
                                onEdit={setEditing}
                                onDelete={handleOnDelete}
                            />
                        )
                    }
                })}
            </div>
            {/* key resets the input text when starting or stopping an edit */}
            <ChatInput
                key={editing?.id ?? 'new'}
                editing={editing}
                onSend={onSend}
                onEdit={onEdit}
                onCancelEdit={(): void => setEditing(null)}
            />
        </div>
    )
}
