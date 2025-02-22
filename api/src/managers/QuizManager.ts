import { AllowedOptions, Quiz } from "../Quiz";
import { IoManager } from "./IoManager";

let globalProblemId = 1;

export class QuizManager {
    private quizzes: Quiz[];
    private static quizManager: QuizManager;

    private constructor() {
        this.quizzes = [];
    }

    public static getQuizManager() {
        if(!this.quizManager) {
            this.quizManager = new QuizManager();
        }
        return this.quizManager;
    }

    public start(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if(!quiz) {
            return;
        }
        quiz.start();
    }

    public addProblem(roomId: string , problem: {
        title: string,
        description: string,
        image: string,
        options: {
            id: number,
            title: string
        }[],
        answer: AllowedOptions
    }) {
        const quiz = this.getQuiz(roomId);
        if(!quiz) {
            return;
        }

        quiz.addProblem({
            ...problem,
            id: (globalProblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: []
        })
    }

    public next(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if(!quiz) {
            return;
        }
        quiz.next();
    }

    addUser(roomId: string, name: string) {
        const quiz = this.getQuiz(roomId);
        
        if(quiz) {
            return quiz.addUser(name);
        }
    }

    getQuiz(roomId: string) {
        return this.quizzes.find(x => x.roomId === roomId);
    }

    submit(roomId: string, problemId: string, submissions: AllowedOptions, userId: string) {
        const quiz = this.getQuiz(roomId);
        if(quiz) {
            quiz.submit(problemId, submissions, userId);
        }
    }

    getCurrentState(roomId: string) {
        const quiz = this.quizzes.find(quiz => quiz.roomId == roomId);

        if(!quiz) {
            return;
        }

        return quiz.getCurrentState();
    }

    addQuiz(roomId: string) {
        const quiz = new Quiz(roomId);
        this.quizzes.push(quiz);
    }
}