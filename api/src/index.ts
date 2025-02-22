import { config } from './config/config';
import express from 'express';
import { IoManager, server } from './managers/IoManager';
import { UserManager } from './managers/UserManager';
import { AdminManager } from './managers/AdminManager';

export const app = express();
const io = IoManager.getIo()

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'WebSocket Server successfully running'
    })
});

const userManager = UserManager.getInstance();
const adminManager = AdminManager.getInstance();

io.on('connection', (socket) => {
    console.log("user connected successfully");
    socket.send("connected");

    socket.on('event', (data) => {
        console.log(data);
        socket.emit("event", data);
        if(data.type=="admin") {
            adminManager.addAdmins("roomId", data.name, socket);
            console.log("adding admin");
        } else {
            userManager.addUser("roomId", socket);
            console.log("adding user");
        }
    });

    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
});


server.listen(config.port, () => {
    console.log(`Server started successfully on port ${config.port}`);
});