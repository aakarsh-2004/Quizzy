import { useState } from "react";
import { socket } from "../socket";

const QuizControls = ({ roomId }: { roomId: string }) => {
    const [isStarted, setIsStarted] = useState<boolean>(false);

    const handleNext = () => {
        socket.emit("next", {
            roomId
        });
    };

    const handleStartQuiz = () => {
        setIsStarted(true);
        console.log("clicked");
        
        socket.emit("startQuiz", {
            roomId
        });
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Quiz Controls</h2>
            <div className="flex justify-center gap-3">
                <button 
                    onClick={handleNext}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
                >
                    Next Problem
                </button>
                <button 
                    onClick={handleStartQuiz}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
                    disabled={isStarted ? true : false}
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizControls;
