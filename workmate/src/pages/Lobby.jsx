import React from "react";
import { useNavigate } from "react-router-dom";

function Lobby({ socket, username, setCurrentLobby, isConnected }) {
  const navigate = useNavigate();

  const handleJoinLobby = (lobbyName) => {
    if (!socket || !isConnected) {
      alert("WebSocket not connected yet!");
      return;
    }

    socket.send(`join_lobby$${lobbyName}`);
    setCurrentLobby(lobbyName);
    navigate("/whiteboard");
  };

  const lobbies = ["Maths", "Biology", "Physics", "Chemistry"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white">
      {/* Logo + Title */}
      <div className="mb-8 text-center animate-fadeIn">
        <h1 className="text-4xl font-bold mb-2">Welcome, {username}!</h1>
        <p className="text-lg text-white/90">
          Join a session below and start collaborating.
        </p>
      </div>

      {/* Lobby Cards */}
      <div className="w-full max-w-md space-y-4 animate-fadeIn">
        {lobbies.map((lobby) => (
          <button
            key={lobby}
            onClick={() => handleJoinLobby(lobby.toLowerCase())}
            className="w-full bg-white text-blue-600 font-semibold py-4 rounded-lg shadow-md hover:bg-blue-700 hover:text-white transition transform hover:scale-[1.02]"
          >
            {lobby}
          </button>
        ))}
      </div>



    </div>
  );
}

export default Lobby;
