import type {ReactElement} from "react";
import './Participants.css';
import type {Participant} from "../../../types/messages.js";

interface Props {
    participants: Participant[];
}

export function Participants({ participants }: Props): ReactElement {
    return (
        <div className="participants">
            {participants.map((participant): ReactElement => (
                <div id={participant.id} className="participant">
                    {participant.name}
                </div>
            ))}
        </div>
    )
}