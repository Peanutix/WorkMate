import React from "react";

function Queue({ currentLobby, lobbyUsers }) {
  return (
    <div className="w-[200px] flex-shrink-0 bg-white border-r border-gray-200 p-4 ">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Lobby: {currentLobby}</h2>
        <p className="text-sm text-gray-500">Active Members</p>
      </div>
      <ul className="space-y-2">
        {lobbyUsers.map((user, idx) => (
          <li
            key={idx}
            className="text-gray-700 bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Queue;
