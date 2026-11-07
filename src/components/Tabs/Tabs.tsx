import type {ButtonHTMLAttributes, PropsWithChildren, ReactElement} from "react";
import './Tabs.css';

export function Tabs(props: PropsWithChildren<object>): ReactElement {
    return (
        <div className="tabs">
            {props.children}
        </div>
    )
}

export function Tab({ active, ...props }: PropsWithChildren<{ active?: boolean; } & ButtonHTMLAttributes<HTMLButtonElement>>): ReactElement {
    const className = ['tab'];
    if (active) className.push('active');
    return (
        <button {...props} className={className.join(' ')}>
            {props.children}
        </button>
    )
}
