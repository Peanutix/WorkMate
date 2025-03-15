import React, { useState } from 'react';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, inputMessage]);
      setInputMessage('');
    }
  };

  return (
      <>
        {/* Chat Toggle Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          {isOpen ? '✖' : '💬'}
        </button>

        {/* Chat Room Box */}
        {isOpen && (
            <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl flex flex-col">
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
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
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
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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