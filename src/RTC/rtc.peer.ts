import {useCallback, useEffect, useRef, useState} from "react";
import type {ClientEvent, EditEvent, ServerEvent} from "../../types/messages.js";

export interface RTCPeerConnectionReturn {
    connected: boolean;
    connect: (name: string) => void;
    disconnect: () => void;
    chat: (text: string) => void;
    edit: (message: EditEvent['value']) => void;
    remove: (id: string) => void;
    error: Error | null;
}

export function useRTCPeerConnection(onMessage: (event: ServerEvent) => void): RTCPeerConnectionReturn {
    const peer = useRef<RTCPeer>(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect((): () => void => {
        const _peer = new RTCPeer({
            config: {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302'}]
        },
            dataChannel: 'chat',
            apiUrl: '/api',
            onMessage,
        });
        peer.current = _peer;

        (async (): Promise<void> => {
            await _peer.initialize();
        })().catch(setError);

        return (): void => {
            _peer.close()
        };
    }, [onMessage]);

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

    const edit = useCallback((message: EditEvent['value']): void => {
        if (!peer.current) return;
        peer.current.editChat(message);
    }, []);

    const remove = useCallback((id: string): void => {
        if (!peer.current) return;
        peer.current.deleteChat(id);
    }, []);

    return {error, connected, connect, disconnect, chat, edit, remove}
}

interface RTCPeerOptions {
    config: RTCConfiguration;
    dataChannel: string;
    apiUrl: string;
    onMessage: (message: ServerEvent) => void;
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
            // todo: Should we send any message here?
        }

        this.dc.onmessage = (e): void => {
            // todo: This should be handled correctly
            options.onMessage(JSON.parse(e.data));
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
        this.sendJSON({type: 'connect', value: name});
    }

    public disconnect(): void {
        this.sendJSON({type: 'disconnect', value: ''});
    }

    public sendChat(text: string): void {
        this.sendJSON({type: 'chat', value: text})
    }

    public editChat(message: EditEvent['value']): void {
        this.sendJSON({type: 'edit', value: message})
    }

    public deleteChat(id: string): void {
        this.sendJSON({type: 'delete', value: id})
    }

    public close(): void {
        this.canceled = true;
        this.pc.close();
        this.dc.close();
    }

    private sendJSON<T extends ClientEvent>(data: T): void {
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
