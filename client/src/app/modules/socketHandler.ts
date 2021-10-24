import * as io from 'socket.io-client';

export namespace SocketHandler {
    let activeSocket: io.Socket;

    export function requestSocket(server: string): unknown {
        if (activeSocket === undefined) {
            activeSocket = io.connect(server);
            console.log(activeSocket);
        }
        return activeSocket;
    }

    export function disconnectSocket(): void {
        activeSocket.disconnect();
        // activeSocket ;
    }
}
