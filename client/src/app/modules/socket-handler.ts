import * as io from 'socket.io-client';
let activeSocket: io.Socket;

export const requestSocket = (server: string): io.Socket => {
    if (activeSocket === undefined) {
        activeSocket = io.connect(server);
    }
    return activeSocket;
};
