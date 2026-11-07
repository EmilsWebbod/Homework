import {Router} from "express";
import nodeDataChannel, {type DataChannel, type PeerConnection} from 'node-datachannel'
import {randomUUID} from "node:crypto";
import type {ClientEvent, Message, Participant, ServerEvent} from "../types/messages.js";

const closedStates = ['closed', 'failed'];
nodeDataChannel.initLogger('Debug', (level, message) => {
    console.log(level, message)
})

const peers = new Set<PeerConnection>()
const participants = new Map<DataChannel, Participant>()
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
        dc.onMessage((message): void => {
            if (typeof message !== 'string') return;
            console.log('message', message)
            try {
                const event: ClientEvent = JSON.parse(message);
                switch (event.type) {
                    case "connect":
                        participants.set(dc, {
                            id: randomUUID(),
                            name: event.value
                        });
                        broadcastParticipants();
                        break;
                    case 'disconnect':
                        participants.delete(dc);
                        broadcastParticipants();
                        break;
                    case "chat":
                        const participant = participants.get(dc);
                        if (!participant) break;
                        messages.push({ id: randomUUID(), text: event.value, participant })
                        broadcastMessages();
                        break;
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
    broadcast({ type: 'participants', data: [...participants.values()] })
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
