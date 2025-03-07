import { IoManager } from "./managers/IoManager";

export type AllowedOptions = 0 | 1 | 2 | 3;
export const PROBLEM_TIME_S = 20;

interface Problem {
    id: string;
    title: string;
    description: string;
    image: string;
    answer: number;
    startTime: number;
    options: {
        id: number;
        title: string
    }[];
    submissions: Submission[];
}


interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedOptions;
};

interface User {
    name: string;
    id: string;
    points: number;
};

export class Quiz {
    public roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private static instance: Quiz;
    private currentState: "leaderboard" | "question" | "not_started" | "ended";

    constructor(roomId: string) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started";

        setInterval(() => {
            this.debug();
        }, 10000);
    }

    debug() {
        console.log("============================================");
        console.log("current state", this.currentState);
        console.log("active problem", this.activeProblem);
        console.log("users", this.users);
        console.log("has started", this.hasStarted);
        console.log("problems", this.problems);
        console.log("============================================");
    }

    addProblem(problem: Problem) {
        this.problems.push(problem);
    }

    public static getInstance(roomId: string) {
        if(!this.instance) {
            this.instance = new Quiz(roomId);
        }
        return this.instance;
    }

    start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
        console.log("quiz started successfully");
    }

    setActiveProblem(problem: Problem) {
        console.log("set active problem");

        this.currentState = "question";
        problem.startTime = new Date().getTime();
        problem.submissions = [];

        IoManager.getIo().emit("CHANGE_PROBLEM", {
            problem: problem
        })

        // Todo: clear this if function moves ahead
        setTimeout(() => {
            this.sendLeaderboard()
        }, PROBLEM_TIME_S * 1000);
    }

    sendLeaderboard() {
        console.log("send leaderboard");

        this.currentState = "leaderboard";
        const leaderboard = this.getLeaderboard();
        IoManager.getIo().to(this.roomId).emit("leaderboard", {
            leaderboard
        });
    }

    next() {
        console.log("onwards to next problem");
        
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        console.log("new problem", problem);
        
        
        if(problem) {
            this.setActiveProblem(problem);
        } else {
            // send final results here
            // io.emit("QUIZ_ENDED", {
            //     problem
            // });
        }
    }

    addUser(name: string) {
        const id = this.generateId();
        console.log("id", id);
        
        this.users.push({
            name,
            id,
            points: 0
        });
        return id;
    }



    submit(problemId: string, option: AllowedOptions, userId: string) {
        const problem = this.problems.find(problem => problem.id === problemId);
        const user = this.users.find(user => user.id == userId);
        
        if(!problem || !user) {
            return;
        }
        
        const existingSub = problem.submissions.find(submission => submission.userId == userId);
        if(existingSub) {
            return;
        }

        problem.submissions.push({
            problemId: problemId,
            userId: userId,
            isCorrect: problem.answer == option,
            optionSelected: option
        });

        user.points += 1000 - 500 * (new Date().getTime() - problem.startTime) / (PROBLEM_TIME_S * 1000);
    }

    getLeaderboard() {
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1).slice(0, 20);
    }

    getCurrentState() {
        if(this.currentState === "not_started") {
            return {
                type: "not_started"
            }
        }
        if(this.currentState === "ended") {
            return {
                type: "ended",
                leaderboard: this.getLeaderboard()
            }
        }

        if(this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard()
            }
        }

        if(this.currentState === "question") {
            return {
                type: "question",
                problem: this.problems[this.activeProblem]
            }
        }
    }

    generateId() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 10) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

};