import React from 'react';

const Prompt = () => {
  return (
    <div className="py-4 px-4">
      <div className="bg-black w-full text-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Question:</h1>
        <input 
          type="text" 
          className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Type your question here..." 
        />
      </div>
    </div>
  );
};

export default Prompt;
