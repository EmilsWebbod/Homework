import {Router} from "express";
import nodeDataChannel, {type DataChannel, type PeerConnection} from 'node-datachannel'
import type {ClientEvent, ServerEvent} from "../types/messages.js";
import {Messages} from "./messages/Messages.js";
import {Participants} from "./participants/Participants.js";

const closedStates = ['closed', 'failed'];
nodeDataChannel.initLogger('Debug', (level, message): void => {
    console.log(level, message)
})

const peers = new Set<PeerConnection>()
const participants = new Participants<DataChannel>();
const messages = new Messages();

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
                        if (messages.add(participant, event.value)){
                            broadcastMessages();
                        }
                        break;
                    }
                    case 'edit': {
                        const participant = participants.get(dc);
                        if (!participant) break;
                        if (messages.edit(participant, event.value.id, event.value.text)) {
                            broadcastMessages();
                        }
                        break;
                    }
                    case 'delete': {
                        const participant = participants.get(dc);
                        if (!participant) break;
                        if (messages.delete(participant, event.value)) {
                            broadcastMessages();
                        }
                        break;
                    }
                }
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
    broadcast({ type: 'messages', data: messages.array() })
}

function broadcast(event: ServerEvent): void {
    const payload = JSON.stringify(event);
    for (const dc of participants.keys()) {
        if (dc.isOpen()) dc.sendMessage(payload)
    }
}

export default api
