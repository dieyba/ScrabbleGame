import * as io from 'socket.io-client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SocketHandler {
    let activeSocket: io.Socket;

    export const requestSocket = (server: string): io.Socket => {
        if (activeSocket === undefined) {
            activeSocket = io.connect(server);
        }
        return activeSocket;
    };

    // export function disconnectSocket(): any {
    //     activeSocket.disconnect();
    //     return activeSocket === undefined;
    // }
}
