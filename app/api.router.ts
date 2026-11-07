import {Router} from "express";
import nodeDataChannel, {type DataChannel, type PeerConnection} from 'node-datachannel'
import {randomUUID} from "node:crypto";
import type {ClientEvent, Message, ServerEvent} from "../types/messages.js";
import {Participants} from "./participants/Participants.js";

const closedStates = ['closed', 'failed'];
nodeDataChannel.initLogger('Debug', (level, message): void => {
    console.log(level, message)
})

const peers = new Set<PeerConnection>()
const participants = new Participants<DataChannel>();

// todo: This is to simple setup. should be moved to DB. Not needed for this project
const messages: Message[] = [];

const api = Router();

api.post('/', (req, res): void => {
    const { sdp, type } = req.body;
    const pc = new nodeDataChannel.PeerConnection('server', {
        iceServers: ['stun:stun.l.google.com:19302']
    })

    pc.onStateChange((state): void => {
        if (closedStates.includes(state)) {
            peers.delete(pc)
        }
    });

    pc.onDataChannel((dc): void => {
        console.log(dc.getId())
        dc.onMessage((message): void => {
            if (typeof message !== 'string') return;
            console.log('message', message)
            try {
                const event: ClientEvent = JSON.parse(message);
                // todo: should verify content is ClientEvent
                // todo: verify that value is correct. Can use joi or something similar to verify
                switch (event.type) {
                    case "connect":
                        participants.add(dc, event.value);
                        broadcastParticipants();
                        break;
                    case 'disconnect':
                        participants.delete(dc);
                        broadcastParticipants();
                        break;
                    case "chat": {
                        const participant = participants.get(dc);
                        if (!participant) break;
                        messages.push({ id: randomUUID(), text: event.value, participant })
                        broadcastMessages();
                        break;
                    }
                    case 'edit': {
                        const participant = participants.get(dc);
                        if (!participant) break;
                        const index = messages.findIndex(x => x.id === event.value.id && x.participant.id === participant.id);
                        if (index === -1) break;
                        messages[index] = {...event.value, participant};
                        broadcastMessages();
                        break;
                    }
                    case 'delete': {
                        const participant = participants.get(dc);
                        if (!participant) break;
                        const index = messages.findIndex(x => x.id === event.value && x.participant.id === participant.id);
                        if (index === -1) break;
                        messages.splice(index, 1);
                        broadcastMessages();
                        break;
                    }
                }

                dc.sendMessage(`echo: ${message}`);
            } catch (e) {
                console.error('error on message', e);
            }
        })

        dc.onClosed((): void => {
            participants.delete(dc);
            broadcastParticipants();
        })
    })

    pc.onGatheringStateChange((state): void => {
        if (state === 'complete') {
            res.json(pc.localDescription());
        }
    })

    pc.setRemoteDescription(sdp, type)

    peers.add(pc)
})

function broadcastParticipants(): void {
    console.debug('Broadcast participants', participants.size);
    broadcast({ type: 'participants', data: participants.array() })
}

function broadcastMessages(): void {
    broadcast({ type: 'messages', data: messages })
}

function broadcast(event: ServerEvent): void {
    const payload = JSON.stringify(event);
    for (const dc of participants.keys()) {
        if (dc.isOpen()) dc.sendMessage(payload)
    }
}

export default api
