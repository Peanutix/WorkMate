import React from "react";

const Lobby = () => {
  return (
    <div className="font-sans bg-[#3C8EFA] m-0 p-0">
      <div className="flex flex-col justify-start items-center p-5 h-screen">
        <div className="bg-white border border-gray-300 p-5 my-3 w-[80%] text-center text-lg rounded-lg shadow-md cursor-pointer hover:bg-[#007bff] hover:text-white active:bg-[#0056b3]">
          Maths
        </div>
        <div className="bg-white border border-gray-300 p-5 my-3 w-[80%] text-center text-lg rounded-lg shadow-md cursor-pointer hover:bg-[#007bff] hover:text-white active:bg-[#0056b3]">
          Biology
        </div>
        <div className="bg-white border border-gray-300 p-5 my-3 w-[80%] text-center text-lg rounded-lg shadow-md cursor-pointer hover:bg-[#007bff] hover:text-white active:bg-[#0056b3]">
          Physics
        </div>
        <div className="bg-white border border-gray-300 p-5 my-3 w-[80%] text-center text-lg rounded-lg shadow-md cursor-pointer hover:bg-[#007bff] hover:text-white active:bg-[#0056b3]">
          Chemistry
        </div>
      </div>
    </div>
  );
};

export default Lobby;
