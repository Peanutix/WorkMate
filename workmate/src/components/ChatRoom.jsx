import React, {useEffect, useState} from 'react';

const ChatRoom = ({ socket }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            socket.send("send_text_chat$" + inputMessage);
            setInputMessage('');
        }
    };

    useEffect(() => {
        const handleMessage = (event) => {
            const data = event.data;
            if (data.startsWith("send_text_chat$")) {
                try {
                    const text = data.split("$")[1];
                    setMessages((prevMessages) => [...prevMessages, text]);
                    console.log("Messages: " + messages);
                } catch {
                    console.log("invalid text")
                }
            }
        };
        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        }
    }, [socket]);

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 z-50"
            >
                {isOpen ? '✖' : '💬'}
            </button>

            {/* Chat Room Box */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl flex flex-col z-50">
                    {/* Chat Header */}
                    <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Chat Room</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                        >
                            ✖
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 max-h-64">
                        {messages.map((msg, index) => (
                            <div key={index} className="mb-2 p-2 bg-white rounded-lg shadow-sm">
                                {msg}
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type a message..."

                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatRoom;