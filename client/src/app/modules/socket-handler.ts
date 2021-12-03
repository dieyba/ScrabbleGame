import * as io from 'socket.io-client';
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

// export function requestSocket(server: string): io.Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap> {
//     throw new Error('Function not implemented.');
// }
