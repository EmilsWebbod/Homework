import './ChatMessage.css'
import type {ReactElement} from "react";
import type {Message} from "../../../types/messages.js";
import {DeleteIcon, EditIcon, InfoIcon} from "../../components/Icons/Icons.js";
import {formatTime} from "../../utils/intl.js";

interface Props {
    message: Message;
}

interface ChatMessageProps extends Props {
    // Only true for messages sent by the connected user
    isOwn?: boolean;
    onEdit?: (message: Message) => void;
    onDelete?: (id: string) => void;
}

export function ChatMessage({ message, isOwn, onEdit, onDelete }: ChatMessageProps): ReactElement {
    return (
        <div className="message">
            <div className="message__title">
                <div className="message__name">
                    {message.participant.name}
                    {isOwn && <span className="message__you"> (you)</span>}
                </div>
                <div className="message__meta">
                    {isOwn && (
                        <div className="message__actions">
                            <button className="icon-button" onClick={(): void => onEdit?.(message)} aria-label="Edit message"><EditIcon /></button>
                            <button className="icon-button" onClick={(): void => onDelete?.(message.id)} aria-label="Delete message"><DeleteIcon /></button>
                        </div>
                    )}
                    <div className="message__date">{formatTime(message.createdAt)}</div>
                </div>
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
