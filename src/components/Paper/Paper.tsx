import type {HTMLAttributes, PropsWithChildren, ReactElement} from "react";
import './Paper.css';
import {CloseIcon} from "../Icons/Icons.js";

interface PaperProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    onClose: () => void;
}

export function Paper({children, title, onClose, ...props}: PropsWithChildren<PaperProps>): ReactElement {
    return (
        <div className="paper" {...props}>
            <div className="paper__title">
                <h2>{title}</h2>
                <button className="icon-button" onClick={onClose}><CloseIcon /></button>
            </div>
            <hr />
            <div className="paper__content">
                {children}
            </div>
        </div>
    )
}
