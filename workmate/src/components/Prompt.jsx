import React from 'react';

const Prompt = () => {
  return (
    <div className="py-4 px-4 w-[700px]">
      <div className="bg-gray-300 w-full t rounded-lg shadow-md p-4 ">
        <h1 className="text-2xl font-semibold mb-4">Question:</h1>
        <input 
          type="text" 
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Type your question here..." 
        />
      </div>
    </div>
  );
};

export default Prompt;
