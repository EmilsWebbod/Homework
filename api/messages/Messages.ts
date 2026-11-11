import {randomUUID} from "node:crypto";
import type {Message, Participant} from "../../types/messages.js";

/**
 * todo: Messages should be saved in a DB of some kind.
 * @remarks The functions would them become async and needs to be processed correctly in the message handler.
 */
//
export class Messages {
    private messages: Message[] = []

    constructor() {
    }

    get size(): number {
        return this.messages.length;
    }

    add(participant: Participant, text: string): boolean {
        // todo: We can verify if any text are not what we want and return false
        this.messages.push({id: this.id(), type: 'message', participant, text, createdAt: this.date() })
        return true;
    }

    edit(participant: Participant, id: string, text: string): boolean {
        const index = this.messages.findIndex(x => x.id === id && x.participant.id === participant.id);
        if (index === -1) return false;
        this.messages[index] = { ...this.messages[index], text };
        return true;
    }

    delete(participant: Participant, id: string): boolean {
        const index = this.messages.findIndex(x => x.id === id && x.participant.id === participant.id);
        if (index === -1) return false;
        this.messages.splice(index, 1);
        return true;
    }

    joined(participant: Participant): void {
        this.messages.push({ id: this.id(), type: 'joined', participant, text: '', createdAt: this.date() });
    }

    left(participant: Participant): void {
        this.messages.push({ id: this.id(), type: 'left', participant, text: '', createdAt: this.date() });
    }

    array(): Message[] {
        return this.messages;
    }

    // used mostly for testing to get messages fast.
    getFromIndex(index: number): Message {
        if (!this.messages[index]) throw new Error(`Message index ${index} not found`);
        return this.messages[index];
    }

    private date(): string {
        return new Date().toISOString()
    }

    private id(): string {
        return randomUUID();
    }
}