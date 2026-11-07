import {useCallback, useEffect, useRef, useState} from "react";
import type {ChatEvent, ConnectEvent, DisconnectEvent} from "../../types/messages.js";

interface RTCPeerConnectionReturn {
    connected: boolean;
    connect: (name: string) => void;
    disconnect: () => void;
    chat: (text: string) => void;
    error: Error | null;
}

export function useRTCPeerConnection(url = '/api'): RTCPeerConnectionReturn {
    const peer = useRef<RTCPeer>(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect((): () => void => {
        const _peer = new RTCPeer({
            config: {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302'}]
        },
            dataChannel: 'chat',
            apiUrl: url
        });
        peer.current = _peer;

        (async (): Promise<void> => {
            await _peer.initialize();
        })().catch(setError);

        return (): void => {
            _peer.close()
        };
    }, [url]);

    const connect = useCallback((name: string): void => {
        if (!peer.current) return;
        peer.current.connect(name);
        setConnected(true);
    }, [])

    const disconnect = useCallback((): void => {
        if (!peer.current) return;
        peer.current.disconnect();
        setConnected(false);
    }, [])

    const chat = useCallback((text: string): void => {
        if (!peer.current) return;
        peer.current.sendChat(text);
    }, []);

    return { error, connected, connect, disconnect, chat }
}

interface RTCPeerOptions {
    config: RTCConfiguration;
    dataChannel: string;
    apiUrl: string;
}

class RTCPeer {
    readonly url: string;
    public pc: RTCPeerConnection;
    public dc: RTCDataChannel;
    private canceled = false;
    constructor(options: RTCPeerOptions) {
        this.url = options.apiUrl;
        this.pc = new RTCPeerConnection(options.config)
        this.dc = this.pc.createDataChannel(options.dataChannel);

        this.dc.onopen = (): void => {
            // todo: Should we send any message here.
            // this.dc.send('hello from browser')
        }

        this.dc.onmessage = (e): void => {
            console.log('server says', e.data);
        }
    }

    public async initialize(): Promise<void> {
        await this.pc.setLocalDescription(await this.pc.createOffer());
        await this.waitForIceGathering(this.pc);
        if (this.canceled) return;
        const res = await fetch(this.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sdp: this.pc.localDescription!.sdp,
                type: this.pc.localDescription!.type,
            }),
        });
        if (this.canceled) return;
        const data = await res.json() as RTCSessionDescriptionInit;
        if (this.canceled) return;
        await this.pc.setRemoteDescription(data);
    }

    public connect(name: string): void {
        this.sendJSON({ type: 'connect', value: name } satisfies ConnectEvent);
    }

    public disconnect(): void {
        this.sendJSON({ type: 'disconnect', value: '' } satisfies DisconnectEvent);
    }

    public sendChat(text: string): void {
        this.sendJSON({ type: 'chat', value: text} satisfies ChatEvent)
    }

    public close(): void {
        this.canceled = true;
        this.pc.close();
        this.dc.close();
    }

    private sendJSON<T>(data: T): void {
        this.send(JSON.stringify(data))
    }

    private send(text: string): void {
        if (this.dc.readyState === "open") this.dc.send(text);
    }

    private waitForIceGathering(pc: RTCPeerConnection): Promise<void> {
        return new Promise((resolve): void => {
            if (pc.iceGatheringState === "complete") return resolve();
            pc.addEventListener("icegatheringstatechange", (): void => {
                if (pc.iceGatheringState === "complete") resolve();
            });
        });
    }
}
