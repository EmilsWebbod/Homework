import {describe, expect, test} from "vitest";
import {Participants} from "../participants/Participants.js";
import {Messages} from "./Messages.js";

describe('Messages', (): void => {
    const participants = new Participants()
    participants.add(0, 'Emil');
    participants.add(1, 'Andreas');

    test('that messages is created and can add and delete', (): void => {
        const messages = new Messages();
        messages.add(participants.get(0), 'Message');
        expect(messages.getFromIndex(0)).to.have.keys(['id', 'participant', 'text', 'createdAt'])
        expect(messages.size).to.equal(1)
        messages.delete(participants.get(0), messages.getFromIndex(0).id);
        expect(messages.size).to.equal(0)
    })

    test('that messages can be edited and only from user that edited', (): void => {
        const messages = new Messages();
        messages.add(participants.get(0), 'Message');
        const message = messages.getFromIndex(0);
        expect(messages.edit(participants.get(0), message.id, 'Edited')).toBeTruthy();
        expect(messages.edit(participants.get(1), message.id, 'Not edited')).toBeFalsy();
        expect(messages.getFromIndex(0).text).to.equal('Edited')
    })

    test('that messages can be deleted and only from user that edited', (): void => {
        const messages = new Messages();
        messages.add(participants.get(0), 'Message');
        const message = messages.getFromIndex(0);
        expect(messages.delete(participants.get(1), message.id)).toBeFalsy();
        expect(messages.size).to.be.equal(1);
        expect(messages.delete(participants.get(0), message.id)).toBeTruthy();
        expect(messages.size).to.be.equal(0);
    })
})