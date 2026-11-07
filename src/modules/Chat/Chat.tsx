import './Chat.css';
import type {ReactElement} from "react";
import type {Message} from "../../../types/messages.js";
import {ChatMessage} from "./ChatMessage.js";

interface Props {
    messages: Message[];
}

export function Chat({messages}: Props): ReactElement {
    return (
        <div className="chat">
            {messages.map((message): ReactElement => (
                <ChatMessage key={message.id} message={message}/>
            ))}
        </div>
    )
}
