import React, { useEffect, useState } from 'react';

const ChatRoom = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      socket.send("send_text_chat$" + inputMessage.trim());
      setInputMessage('');
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      if (data.startsWith("send_text_chat$")) {
        try {
          const text = data.split("$")[1];
          setMessages((prev) => [...prev, text]);
        } catch {
          console.log("Invalid text");
        }
      }
    };
    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition duration-300 z-50 text-xl"
        title={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? '✖' : '💬'}
      </button>

      {/* Chat Room Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-80 bg-white rounded-xl shadow-2xl flex flex-col z-50 animate-fadeInUp">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h2 className="text-lg font-bold">Chat Room</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200 text-xl transition"
            >
              ✖
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100 max-h-64 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="p-2 bg-white rounded-lg shadow-sm text-gray-800"
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
