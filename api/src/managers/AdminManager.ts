import { Socket } from "socket.io"
import { QuizManager } from "./QuizManager";

export class AdminManager {
    private admins: {
        roomId: string;
        socket: Socket;
        name: string;
    }[];
    private static instance: AdminManager;
    private quizManager: QuizManager = QuizManager.getQuizManager();
    private ADMIN_PASSWORD;

    private constructor() {
        this.ADMIN_PASSWORD = "1234";
        this.admins = [];
    }

    public static getInstance() {
        if(!this.instance) {
            this.instance = new AdminManager();
        }
        return this.instance;
    }

    addAdmins(roomId: string, name: string, socket: Socket) {
        this.admins.push({
            roomId,
            socket,
            name
        });

        this.createHandlers(roomId, socket);
    }


    private createHandlers(roomId: string, socket: Socket) {
        socket.on("joinAdmin", (data) => {
            const adminId = this.quizManager.addUser(data.roomId, data.name);
            
            if(data.password != this.ADMIN_PASSWORD) {
                return;
            }
            
            console.log("admin joined successfully");
            console.log(data.name, data.roomId, data.password);
            

            socket.emit("admin_init", {
                adminId: adminId,
                state: this.quizManager.getCurrentState(roomId)
            });

            socket.on("createProblem", (data) => {
                const roomId = data.roomId;
                const problem = data.problem;

                // console.log("problem created successfully by admin", problem);

                this.quizManager.addProblem(roomId, problem);
            });

            socket.on("createQuiz", (data) => {
                this.quizManager.addQuiz(data.roomId);
            })

            socket.on("next", (data) => {
                const roomId = data.roomId;
                this.quizManager.next(roomId);
            });
        });
    };
}