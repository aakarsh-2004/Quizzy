import { config } from './config/config';
import express from 'express';
import { IoManager, server } from './managers/IoManager';

export const app = express();
const io = IoManager.getIo()

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'WebSocket Server successfully running'
    })
});


io.on('connection', (socket) => {
    console.log("user connected successfully");
    socket.send("connected");

    socket.on('event', (data) => {
        console.log(data);
        socket.emit("event", data)
    });

    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
});


server.listen(config.port, () => {
    console.log(`Server started successfully on port ${config.port}`);
});