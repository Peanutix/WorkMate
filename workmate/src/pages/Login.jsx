import React from 'react';
import logo from '../assets/workmate_logo2.png';

const Login = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-blue-500 font-inter text-lg">
            <div className="flex flex-col items-center text-center w-full">
                <img src={logo} alt="Logo" className="w-[500px] mb-5" />
                <div className="bg-white p-5 rounded-lg shadow-md w-80">
                    <p className="text-2xl font-bold">Login</p>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="w-full p-2 my-2 border border-gray-300 rounded-md text-base"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-2 my-2 border border-gray-300 rounded-md text-base"
                    />
                    <button 
                        className="w-full p-2 mt-2 bg-blue-600 text-white rounded-md text-base font-semibold hover:bg-blue-700"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;