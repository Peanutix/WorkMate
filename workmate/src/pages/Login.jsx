import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ socket, setUsername, isConnected }) {
  const navigate = useNavigate();
  const [localUsername, setLocalUsername] = useState("");

  const handleLogin = () => {
    if (!socket || !isConnected) {
      alert("WebSocket not connected yet!");
      return;
    }
    if (!localUsername) {
      alert("Please enter a username!");
      return;
    }

    // Save in your global state
    setUsername(localUsername);

    // Send login message to server
    socket.send(`login;${localUsername}`);

    // Now go to the Lobby page
    navigate("/lobby");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <div className="bg-white p-5 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          className="w-full p-2 my-2 border border-gray-300 rounded-md text-base"
        />
        <button
          className="w-full p-2 mt-2 bg-blue-600 text-white rounded-md text-base font-semibold hover:bg-blue-700"
          onClick={handleLogin}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Login;
