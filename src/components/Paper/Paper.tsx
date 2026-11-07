import type {PropsWithChildren, ReactElement} from "react";
import './Paper.css';
import {CloseIcon} from "../Icons/Icons.js";

interface PaperProps {
    title: string;
}

export function Paper({children, title}: PropsWithChildren<PaperProps>): ReactElement {
    return (
        <div className="paper">
            <div className="paper__title">
                <h2>{title}</h2>
                <button className="icon-button"><CloseIcon /></button>
            </div>
            <hr />
            <div className="paper__content">
                {children}
            </div>
        </div>
    )
}
