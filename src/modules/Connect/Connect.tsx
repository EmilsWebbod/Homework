import './Connect.css';
import {type ReactElement, type SubmitEvent, useCallback, useState} from "react";

interface Props {
    onConnect: (name: string) => void;
}

export function Connect({onConnect}: Props): ReactElement {
    const [name, setName] = useState('');

    const handleOnSubmit = useCallback((event: SubmitEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (name.trim()) {
            onConnect(name.trim());
        }
    }, [onConnect, name])

    return (
        <form className="connect" onSubmit={handleOnSubmit}>
            <label className="connect__label" htmlFor="connect-name">Your name</label>
            <input
                id="connect-name"
                className="connect__input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
            />
            <button className="connect__button" disabled={!name.trim()}>
                Connect
            </button>
        </form>
    )
}
