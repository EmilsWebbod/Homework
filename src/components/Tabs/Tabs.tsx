import type {PropsWithChildren, ReactElement} from "react";
import './Tabs.css';

export function Tabs(props: PropsWithChildren<object>): ReactElement {
    return (
        <div className="tabs">
            {props.children}
        </div>
    )
}

export function Tab(props: PropsWithChildren<{ active?: boolean; }>): ReactElement {
    const className = ['tab'];
    if (props.active) className.push('active');
    return (
        <button className={className.join(' ')}>
            {props.children}
        </button>
    )
}
