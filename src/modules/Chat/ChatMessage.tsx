import './ChatMessage.css'
import type {ReactElement} from "react";
import type {Message} from "../../../types/messages.js";
import {InfoIcon} from "../../components/Icons/Icons.js";
import {formatTime} from "../../utils/intl.js";

interface Props {
    message: Message;
}

export function ChatMessage({ message }: Props): ReactElement {
    return (
        <div className="message">
            <div className="message__title">
                <div className="message__name">{message.participant.name}</div>
                <div className="message__date">{formatTime(message.createdAt)}</div>
            </div>
            <div className="message__text">
                {message.text}
            </div>
        </div>
    )
}

export function ChatStatus({ message, status }: Props & { status: string }): ReactElement {
    return (
        <div className="message">
            <div className="message__title">
                <div className="message__status">
                    <InfoIcon />
                    <div>{message.participant.name} <span>{status}</span></div>
                </div>
                <div className="message__date">{formatTime(message.createdAt)}</div>
            </div>
        </div>
    )
}
