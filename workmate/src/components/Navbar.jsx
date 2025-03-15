import React from 'react';
import logo from '../assets/workmate_logo2.png';
import { useNavigate } from "react-router-dom";

const Navbar = ( { leaveLobbyFunc, currentLobby, socket } ) => {


  const navigate = useNavigate()




  function navigateToLobby(){
    leaveLobbyFunc()
    navigate("/lobby")
  }


  function navigateToLogin(){
    leaveLobbyFunc()
    navigate("/")
      socket.send("return_login;")
  }

  return (
    <>
      <nav className='p-2 border-solid border-gray-600 bg-black'>
        <div className='flex items-center justify-between'>
            
            {/* Logo */}
            <div className='flex items-center justify-start cursor-pointer'
            onClick={navigateToLogin}
            >
             <img src={logo} alt="Logo" className="  w-[200px]  invert" 
             />
            </div>

            {/* Button to go from Whiteboard to Lobby  */}
            <div>
                {currentLobby !== "" ? <button
              onClick={navigateToLobby}
              className="text-white bg-blue-400 p-2 rounded-lg">
              Return to Lobby  
              </button> : null}
            </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;
