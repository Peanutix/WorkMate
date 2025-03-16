import React, { useState } from 'react';

const AIChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage.trim(), sender: 'user' }]);
      setInputMessage('');
      // Simulated AI response (optional)
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I'm here to help!", sender: 'ai' }]);
      }, 500);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-20 bg-purple-600 text-white p-4 rounded-full shadow-xl hover:bg-purple-700 transition duration-300 z-50 text-xl"
        title={isOpen ? "Close AI Chat" : "Chat with Mate AI"}
      >
        {isOpen ? '✖' : '🤖'}
      </button>

      {/* Chat Room Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-80 bg-white rounded-xl shadow-2xl flex flex-col z-50 animate-fadeInUp">
          {/* Chat Header */}
          <div className="bg-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h2 className="text-lg font-bold">Mate AI</h2>
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
                className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-purple-100 text-gray-800 self-end'
                    : 'bg-gray-200 text-gray-700 self-start'
                }`}
              >
                {msg.text}
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
                placeholder="Ask Mate AI..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
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

export default AIChatRoom;
