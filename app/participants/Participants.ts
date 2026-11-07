import {randomUUID} from "node:crypto";
import {type Participant} from "../../types/messages.js";

export class Participants<T> extends Map<T, Participant> {

    constructor() {
        super();
    }

    array(): Participant[] {
        return [...this.values()]
    }

    add(id: T, name: string): void {
        this.set(id, {
            id: randomUUID(),
            name: name
        });
    }
}