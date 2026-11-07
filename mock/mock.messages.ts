import {Message} from "../types/messages.js";
import {mockParticipants} from "./mock.participants.js";

const [emil, ingrid, lars, sofia, mateo, aisha, henrik] = mockParticipants;

export const mockMessages: Message[] = [
    {
        id: 'm01',
        participant: emil,
        createdAt: '2026-11-07T09:00:12.000Z',
        text: 'Morning everyone! Is the DataChannel connection stable for you?'
    },
    {
        id: 'm02',
        participant: ingrid,
        createdAt: '2026-11-07T09:00:41.000Z',
        text: 'Morning! Yep, connected and seeing everyone in the list.'
    },
    {id: 'm03', participant: lars, createdAt: '2026-11-07T09:01:05.000Z', text: 'Same here. Latency feels really low.'},
    {
        id: 'm04',
        participant: sofia,
        createdAt: '2026-11-07T09:01:30.000Z',
        text: 'Just joined, give me a sec to catch up on the history.'
    },
    {
        id: 'm05',
        participant: mateo,
        createdAt: '2026-11-07T09:02:02.000Z',
        text: 'Hola! Does anyone know if messages are ordered across peers?'
    },
    {
        id: 'm06',
        participant: emil,
        createdAt: '2026-11-07T09:02:48.000Z',
        text: 'DataChannels are ordered and reliable by default, but across peers we sort by createdAt.'
    },
    {id: 'm07', participant: aisha, createdAt: '2026-11-07T09:03:15.000Z', text: 'So clock skew could be a problem?'},
    {
        id: 'm08',
        participant: emil,
        createdAt: '2026-11-07T09:03:50.000Z',
        text: 'Good point. For this exercise the host stamps the time, so we avoid it.'
    },
    {
        id: 'm09',
        participant: henrik,
        createdAt: '2026-11-07T09:04:20.000Z',
        text: 'Hi all, sorry I am late. What did I miss?'
    },
    {
        id: 'm10',
        participant: ingrid,
        createdAt: '2026-11-07T09:04:44.000Z',
        text: 'Mostly talk about message ordering. Scroll up if you want the details.'
    },
    {
        id: 'm11',
        participant: lars,
        createdAt: '2026-11-07T09:05:30.000Z',
        text: 'Can we test editing? I will send something with a typo.'
    },
    {id: 'm12', participant: lars, createdAt: '2026-11-07T09:05:41.000Z', text: 'Thsi message has a typo in it.'},
    {
        id: 'm13',
        participant: lars,
        createdAt: '2026-11-07T09:06:02.000Z',
        text: 'This message has a typo in it. (edited)'
    },
    {id: 'm14', participant: sofia, createdAt: '2026-11-07T09:06:40.000Z', text: 'Edit worked on my side too, nice.'},
    {
        id: 'm15',
        participant: mateo,
        createdAt: '2026-11-07T09:07:10.000Z',
        text: 'What happens when someone deletes a message? Does it vanish for everyone?'
    },
    {
        id: 'm16',
        participant: emil,
        createdAt: '2026-11-07T09:07:45.000Z',
        text: 'Yes, a delete event is broadcast with the message id and every peer removes it.'
    },
    {id: 'm17', participant: aisha, createdAt: '2026-11-07T09:08:20.000Z', text: 'And if a peer drops and rejoins?'},
    {
        id: 'm18',
        participant: emil,
        createdAt: '2026-11-07T09:08:58.000Z',
        text: 'They get a fresh snapshot: a participants event and a messages event.'
    },
    {
        id: 'm19',
        participant: henrik,
        createdAt: '2026-11-07T09:09:30.000Z',
        text: 'Let me try that. Disconnecting for a moment...'
    },
    {id: 'm20', participant: henrik, createdAt: '2026-11-07T09:10:15.000Z', text: 'Back! History is all there.'},
    {
        id: 'm21',
        participant: ingrid,
        createdAt: '2026-11-07T09:10:40.000Z',
        text: 'Works nicely. What about very long messages?'
    },
    {
        id: 'm22',
        participant: sofia,
        createdAt: '2026-11-07T09:11:05.000Z',
        text: 'SCTP has message size limits, so we may want to cap at around 16 KB.'
    },
    {
        id: 'm23',
        participant: lars,
        createdAt: '2026-11-07T09:11:50.000Z',
        text: 'A max length in the input would be a simple trade-off for this scope.'
    },
    {
        id: 'm24',
        participant: mateo,
        createdAt: '2026-11-07T09:12:30.000Z',
        text: 'Agreed. Also worth noting: mesh topology gets heavy past 8 or so peers.'
    },
    {
        id: 'm25',
        participant: aisha,
        createdAt: '2026-11-07T09:13:00.000Z',
        text: 'A star topology with a host relaying would scale better, at the cost of a single point of failure.'
    },
    {
        id: 'm26',
        participant: emil,
        createdAt: '2026-11-07T09:13:40.000Z',
        text: 'Exactly the kind of trade-off I want to document in the README.'
    },
    {
        id: 'm27',
        participant: henrik,
        createdAt: '2026-11-07T09:14:10.000Z',
        text: 'Sounds good. Anyone up for a quick demo run-through?'
    },
    {id: 'm28', participant: ingrid, createdAt: '2026-11-07T09:14:35.000Z', text: 'Ready when you are!'},
    {id: 'm29', participant: sofia, createdAt: '2026-11-07T09:14:52.000Z', text: 'Same, let us do it.'},
    {id: 'm30', participant: emil, createdAt: '2026-11-07T09:15:20.000Z', text: 'Great, starting now. Thanks all!'},
];