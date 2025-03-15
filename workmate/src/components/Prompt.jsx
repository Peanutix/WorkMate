import React, { useState, useEffect } from "react";

const Prompt = ({ socket, username, currentLobby }) => {
    const [question, setQuestion] = useState("");
    const [receivedQuestion, setReceivedQuestion] = useState("");

    useEffect(() => {
        if (!socket) return;

        socket.onopen = () => {
            console.log("WebSocket connection established"); // Debugging
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed"); // Debugging
        };

        // Listen for incoming messages
        const handleMessage = (event) => {
            const message = event.data;
            console.log("Received message:", message); // Debugging: Log incoming messages

            const [context, data] = message.split(";", 2);

            if (context === "question") {
                // Update the received question state
                setReceivedQuestion(data);
                console.log("Updated received question:", data); // Debugging: Log state update
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            // Clean up the WebSocket listener
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket]);

    useEffect(() => {
        console.log("Received question updated:", receivedQuestion); // Debugging: Log state changes
    }, [receivedQuestion]);

    const handlePublish = () => {
        if (socket && question.trim() && currentLobby) {
            // Send the question to the server
            socket.send(`publish_question;${question}`);
            console.log("Sent question:", question); // Debugging: Log sent message
            setQuestion(""); // Clear the input field
        } else {
            alert("You must be in a lobby to publish a question!");
        }
    };

    return (
        <div className="py-4 px-4 w-[700px]">
            <div className="bg-gray-300 w-full rounded-lg shadow-md p-4">
                <h1 className="text-2xl font-semibold mb-4">
                    Question:{" "}
                    <span className="font-normal">
                    {receivedQuestion}
                </span>
                {console.log("Rendering receivedQuestion:", receivedQuestion)} {/* Debugging */}
                </h1>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="flex-1 p-2 rounded-md border border-gray-600 bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your question here..."
                    />
                    <button
                        onClick={handlePublish}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Publish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Prompt;