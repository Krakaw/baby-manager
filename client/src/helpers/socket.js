import {serverUrl} from "../config";

class Socket {

    constructor (options = {}) {

        this.socket = null;
        this.options = {
            // eslint-disable-next-line no-empty-function
            "onSocketClose": () => {},
            // eslint-disable-next-line no-empty-function
            "onSocketMessage": () => {},
            serverUrl,
            ...options

        };

    }


    connect () {

        this.socket = new WebSocket(`ws://${serverUrl}/ws`);
        this.socket.onmessage = this.options.onSocketMessage;
        this.socket.onclose = this.options.onSocketClose;

    }

}

export default Socket;
