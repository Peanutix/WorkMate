import React from 'react';
import logo from '../assets/workmate_logo.png';
import { useNavigate } from "react-router-dom";

const Navbar = ({ leaveLobbyFunc, currentLobby, socket }) => {
  const navigate = useNavigate();

  function navigateToLobby(){
    leaveLobbyFunc();
    navigate("/lobby");
  }

  function navigateToLogin(){
    leaveLobbyFunc();
    navigate("/");
    socket.send("return_login$");
  }

  return (
    <nav className="p-2 border-solid border-gray-600 bg-black">
      <div className="flex items-center w-full">

        {/* Left - Logo */}
        <div 
          className="flex-1 flex items-center justify-start cursor-pointer"
          onClick={navigateToLogin}
        >
          <img src={logo} alt="Logo" className="w-[200px] invert" />
        </div>

        {/* Center - Links */}
        <div className="flex-1 flex items-center justify-center space-x-6">
          <div className="hover:text-blue-500 cursor-pointer text-white transition">
            Home
          </div>
          <div className="hover:text-blue-500 cursor-pointer text-white transition">
            Docs
          </div>
          <div className="hover:text-blue-500 cursor-pointer text-white transition">
            GitHub
          </div>
        </div>

        {/* Right - Button */}
        <div className="flex-1 flex items-center justify-end">
          {currentLobby !== "" && (
            <button
              onClick={navigateToLobby}
              className="text-white bg-blue-400 p-2 rounded-lg"
            >
              Go to Lobby
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
