import * as io from 'socket.io-client';

export namespace SocketHandler {
    let activeSocket: io.Socket;

    export function requestSocket(server: string): io.Socket {
        if (activeSocket === undefined) {
            activeSocket = io.connect(server);
        }
        return activeSocket;
    }

    // export function disconnectSocket(): any {
    //     activeSocket.disconnect();
    //     return activeSocket === undefined;
    // }
}
