import React from "react";
import { useNavigate } from "react-router-dom";

function Lobby({ socket, username, setCurrentLobby, isConnected }) {
  const navigate = useNavigate();

  const handleJoinLobby = (lobbyName) => {
    if (!socket || !isConnected) {
      alert("WebSocket not connected yet!");
      return;
    }
    // join the selected lobby
    socket.send(`join_lobby;${lobbyName}`);

    // store the lobby in global state, so Whiteboard knows
    setCurrentLobby(lobbyName);

    // navigate to the Whiteboard
    navigate("/whiteboard");
  };

  return (
    <div className="bg-[#3C8EFA] h-screen flex flex-col items-center pt-5">
      <h1 className="text-white text-2xl mb-4">Welcome Join Any Session!</h1>
      <button
        onClick={() => handleJoinLobby("maths")}
        className="bg-white p-5 my-3 w-[80%] text-center text-lg rounded-lg shadow-md hover:bg-[#007bff] hover:text-white"
      >
        Maths
      </button>
      <button
        onClick={() => handleJoinLobby("biology")}
        className="bg-white p-5 my-3 w-[80%] text-center text-lg rounded-lg shadow-md hover:bg-[#007bff] hover:text-white"
      >
        Biology
      </button>
      <button
        onClick={() => handleJoinLobby("physics")}
        className="bg-white p-5 my-3 w-[80%] text-center text-lg rounded-lg shadow-md hover:bg-[#007bff] hover:text-white"
      >
        Physics
      </button>
      <button
        onClick={() => handleJoinLobby("chemistry")}
        className="bg-white p-5 my-3 w-[80%] text-center text-lg rounded-lg shadow-md hover:bg-[#007bff] hover:text-white"
      >
        Chemistry
      </button>
    </div>
  );
}

export default Lobby;
