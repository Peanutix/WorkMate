import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/workmate_logo.png';

function Login({ socket, setUsername, isConnected }) {
  const navigate = useNavigate();
  const [localUsername, setLocalUsername] = useState("");

  const handleLogin = () => {
    if (!socket || !isConnected) {
      alert("WebSocket not connected yet!");
      return;
    }
    if (!localUsername.trim()) {
      alert("Please enter a username!");
      return;
    }

    setUsername(localUsername.trim());
    socket.send(`login$${localUsername.trim()}`);
    navigate("/lobby");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 text-gray-800">
      {/* Logo */}
      <div className="mb-6 text-white text-3xl font-bold tracking-wide animate-fadeIn">
        <img src={logo} alt="Logo" className="w-[500px] invert" />
      </div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.02] animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-2">Create a Username</h2>
        <p className="text-center text-gray-500 mb-6">
          Join the collaboration and start creating together.
        </p>

        <input
          type="text"
          placeholder="Enter your username"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 transition mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
        >
          Join
        </button>
      </div>


    </div>
  );
}

export default Login;
