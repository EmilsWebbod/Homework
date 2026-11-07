import './ChatInput.css';
import {type KeyboardEvent, type ReactElement, type SubmitEvent, useCallback, useState} from "react";
import type {EditEvent, Message} from "../../../types/messages.js";
import {CloseIcon, SendIcon} from "../../components/Icons/Icons.js";

export interface ChatInputProps {
    onSend: (message: string) => void;
}

interface Props extends ChatInputProps {
    // When set, the input edits this message instead of sending a new one
    editing: Message | null;
    onEdit: (message: EditEvent['value']) => void;
    onCancelEdit: () => void;
}

export function ChatInput({onSend, editing, onEdit, onCancelEdit}: Props): ReactElement {
    const [value, setValue] = useState(editing?.text ?? '');

    const handleOnSubmit = useCallback((event: SubmitEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!value.trim()) return;
        if (editing) {
            onEdit({id: editing.id, text: value});
            onCancelEdit();
        } else {
            onSend(value);
        }
        setValue('');
    }, [onSend, onEdit, onCancelEdit, editing, value])

    // Enter sends, Shift+Enter adds a new line
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
        event.preventDefault();
        event.currentTarget.form?.requestSubmit();
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <div className="chat-input">
                <textarea
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write to everyone"
                    autoFocus={!!editing}
                />
                <div className="chat-input__footer">
                    <div className="chat-input__actions"></div>
                    <div className="chat-input__send">
                        {editing && (
                            <button type="button" className="icon-button" onClick={onCancelEdit} aria-label="Cancel edit"><CloseIcon/></button>
                        )}
                        <button className="icon-button" aria-label={editing ? 'Save edit' : 'Send'}><SendIcon/></button>
                    </div>
                </div>
            </div>
        </form>
    )
}
