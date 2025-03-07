import { useEffect, useState } from "react";
import { socket } from "../socket";
import CreateProblem from "./CreateProblem";
import QuizControls from "./QuizControls";

const Admin = () => {
    const [roomId, setRoomId] = useState("");
    const [name, setName] = useState("");
    const [quiz, setQuiz] = useState<string>("");

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connection successful by admin");

            socket.emit("event", {
                type: "admin"
            });
        })

        return () => {
            socket.off("connect", () => {
                console.log("User disconnected successfully");
            });
        }
    }, []);

    const createQuiz = () => {
        socket.emit("joinAdmin", {
            password: "1234",
            roomId: roomId,
            name: name
        });

        socket.emit("createQuiz", {
            roomId: roomId
        });
        setQuiz(roomId);
    }

    if(!quiz) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">Admin Panel</h1>
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Room ID" 
                            onChange={(e) => setRoomId(e.target.value)} 
                            value={roomId}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required={true}
                        />
                        <input 
                            type="text" 
                            placeholder="Your Name" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required={true}
                        />
                        <button 
                            type="submit"
                            onClick={createQuiz}
                            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
                        >
                            Create Quiz
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <CreateProblem roomId={roomId} />
            <QuizControls roomId={roomId} />
        </div>
    )
}

export default Admin;
