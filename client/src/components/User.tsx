import { useEffect, useState } from "react";
import { socket } from "../socket";
import Question from "./Question";
import Leaderboard from "./Leaderboard";

type CurrentState = "not_started" | "question" | "leaderboard" | "ended";

const User = () => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [currentState, setCurrentState] = useState<CurrentState>("not_started");
  const [joined, setJoined] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connection successful by user");

      socket.emit("event", {
        type: "user"
      });
    });

    socket.on("init", ({ userId, state }: {
      userId: string,
      state: {
        type: CurrentState,
        leaderboard?: any,
        problem?: any
      }
    }) => {
      console.log("userId", userId);
      console.log("state", state);
      
      setCurrentState(state.type);
      setUserId(userId);

      if(state.leaderboard) {
        setLeaderboard(state.leaderboard);
      }
      if(state.problem) {
        setCurrentQuestion(state.problem)
      }
    })

    return () => {
      socket.off("connect", () => {
        console.log("User disconnected successfully");
      });
    }
  }, []);

  const joinRoom = () => {
    setJoined(true);

    socket.emit("joinUser", {
      roomId: roomId,
      name: name
    });
  }

  if(joined) {
    if(currentState === "not_started") {
      return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Quiz Status</h2>
          <p className="text-center text-gray-700">This quiz hasn't been started yet.</p>
        </div>
      );
    } else if(currentState === "question") {
      return <Question question={currentQuestion} />
    } else if(currentState === "leaderboard") {
      return <Leaderboard leaderboard={leaderboard} />
    } else {
      return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Quiz Status</h2>
          <p className="text-center text-gray-700">This quiz has ended.</p>
        </div>
      );
    }
  }

  if (!joined) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Join Quiz</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Room Id"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={joinRoom}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
          >
            Join Room
          </button>
        </div>
      </div>
    )
  }

  return null;
}

export default User;
