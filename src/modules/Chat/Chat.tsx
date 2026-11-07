import './Chat.css';
import type {ReactElement} from "react";
import type {Message} from "../../../types/messages.js";
import {ChatInput, type ChatInputProps} from "./ChatInput.js";
import {ChatMessage, ChatStatus} from "./ChatMessage.js";

interface Props extends ChatInputProps {
    messages: Message[];
}

export function Chat({messages, onSend}: Props): ReactElement {
    return (
        <div className="chat">
            <div className="chat__messages">
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
