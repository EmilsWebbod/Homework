import {describe, expect, test} from "vitest";
import {Participants} from "./Participants.js";

describe('Participant', (): void => {
    test('that participant works as intended by adding and deleting users', (): void => {
        const participants = new Participants()
        expect(participants).toBeTruthy();
        participants.add(0, 'Emil');
        expect(participants.size).to.equal(1);
        expect(participants.array()).to.be.length(1);
        expect(participants.array()[0]).to.have.keys(['id', 'name'])
        participants.delete(0);
        expect(participants.size).to.equal(0)
    })
})