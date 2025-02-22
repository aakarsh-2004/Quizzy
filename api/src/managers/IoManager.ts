import http from 'http';

import { Server } from "socket.io";
import { app } from '../index';
export const server = http.createServer(app); 

export class IoManager {
    private static io: Server;

    public static getIo() {
        if(!this.io) {
            const io = new Server(server, {
                cors: {
                    origin: 'http://localhost:5173'
                }
            });
            this.io = io;
        }
        return this.io;
    }


}