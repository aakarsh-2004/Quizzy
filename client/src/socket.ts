import { io } from 'socket.io-client';
const URL = 'http://localhost:7890';

export const socket = io(URL);