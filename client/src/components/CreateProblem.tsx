import { useState } from "react"
import { socket } from "../socket";

const CreateProblem = ({ roomId }: { roomId: string }) => {
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState([
        { id: 1, title: "" },
        { id: 2, title: "" },
        { id: 3, title: "" },
        { id: 4, title: "" }
    ]);
    const [answer, setAnswer] = useState<number>(0);
    const [description, setDescription] = useState("");

    const createProblem = () => {
        socket.emit("createProblem", {
            roomId: roomId,
            problem: {
                title,
                description: description,
                image: "image.jpg",
                options,
                answer: answer
            }
        })
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">Create Problem</h1>
            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Enter problem title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                        id="description"
                        type="text"
                        placeholder="Enter Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Options</h2>
                    {[1, 2, 3, 4].map(optionId => (
                        <div key={optionId} className="flex items-center gap-2">
                            <input type="radio" name="answer" id="answer" onChange={() => setAnswer(optionId)} />
                            <span className="w-24 text-sm font-medium text-gray-600">Option {optionId}</span>
                            <input
                                type="text"
                                placeholder={`Enter option ${optionId}`}
                                value={options.find(option => option.id === optionId)?.title}
                                onChange={(e) => {
                                    setOptions(options.map(option => 
                                        option.id === optionId ? {...option, title: e.target.value} : option
                                    ))
                                }}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={createProblem}
                className="w-full mt-8 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
            >
                Create Problem
            </button>
        </div>
    )
}

export default CreateProblem
