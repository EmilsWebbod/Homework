import './ChatInput.css';
import {type ReactElement, type SubmitEvent, useCallback, useState} from "react";
import {SendIcon} from "../../components/Icons/Icons.js";

export interface ChatInputProps {
    onSend: (message: string) => void;
}

export function ChatInput({onSend}: ChatInputProps): ReactElement {
    const [value, setValue] = useState('');

    const handleOnSubmit = useCallback((event: SubmitEvent<HTMLFormElement>): void => {
        event.preventDefault();
        onSend(value);
        setValue('');
    }, [onSend, value])

    return (
        <form onSubmit={handleOnSubmit}>
            <div className="chat-input">
                <textarea value={value} onChange={e => setValue(e.target.value)} placeholder="Write to everyone"/>
                <div className="chat-input__footer">
                    <div className="chat-input__actions"></div>
                    <div className="chat-input__send">
                        <button className="icon-button"><SendIcon/></button>
                    </div>
                </div>
            </div>
        </form>
    )
}
