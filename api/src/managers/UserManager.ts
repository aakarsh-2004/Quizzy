import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
import { AllowedOptions } from "../Quiz";

export class UserManager {
    private users: {
        roomId: string,
        socket: Socket;
    }[];
    private static instance: UserManager;
    private quizManager: QuizManager = QuizManager.getQuizManager();

    constructor() {
        this.users = [];
    }

    public static getInstance() {
        if(!this.instance) {
            this.instance = new UserManager();
        };
        return this.instance;
    }

    addUser(roomId: string, socket: Socket) {
        this.users.push({
            socket, roomId
        })
        this.createHandlers(roomId, socket);
    }

    private createHandlers(roomId: string, socket: Socket) {
        socket.on("join", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(roomId)
            });
        });

        socket.on("submit", (data) => {
            const userId: string = data.userId;
            const problemId: string = data.problemId;
            const submission: AllowedOptions = data.submission;

            if(submission < 0 && submission > 3) {
                console.error("error while getting input " + submission);
                return;
            }

            this.quizManager.submit(roomId, problemId, submission, userId);
        })
    }
} 