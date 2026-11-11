import {randomUUID} from "node:crypto";
import {type Participant} from "../../types/messages.js";

// todo: Participants should have been saved in a redis session. To make sure if we have any disconnects, that we keep them live and can reconnect
export class Participants<T> extends Map<T, Participant> {

    constructor() {
        super();
    }

    array(): Participant[] {
        return [...this.values()]
    }

    add(id: T, name: string): Participant {
        const participant: Participant = {
            id: randomUUID(),
            name: name
        }
        this.set(id, participant);
        return participant;
    }
}