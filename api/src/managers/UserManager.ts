import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
import { AllowedOptions } from "../Quiz";

export class UserManager {
    private static instance: UserManager;
    private quizManager: QuizManager = QuizManager.getQuizManager();

    public static getInstance() {
        if(!this.instance) {
            this.instance = new UserManager();
        };
        return this.instance;
    }

    addUser(socket: Socket) {
        this.createHandlers(socket);
    }

    private createHandlers(socket: Socket) {
        socket.on("joinUser", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            
            if(userId) {
                console.log("user joined successfully");
                console.log(data.name, data.roomId);
                console.log('useriD', userId);            
                
                socket.emit("init", {
                    userId,
                    state: this.quizManager.getCurrentState(data.roomId)
                });
            } else {
                console.error("user could not be joined");
            }
        });

        socket.on("submit", (data) => {
            const userId: string = data.userId;
            const problemId: string = data.problemId;
            const submission: AllowedOptions = data.submission;

            if(submission < 0 && submission > 3) {
                console.error("error while getting input " + submission);
                return;
            }

            this.quizManager.submit(data.roomId, problemId, submission, userId);
        })
    }
} 