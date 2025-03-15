import React from 'react';
import logo from '../assets/workmate_logo2.png';


const Navbar = ( ) => {
  return (
    <div>
      <nav className='p-2 border-solid border-gray-600 bg-black'>
        <div className='flex items-center justify-between'>

          <div>
            {/* <h1 className='text-xl font-bold text-white'>
              workmate
            </h1> */}
            <div className='flex items-center justify-start'>
             <img src={logo} alt="Logo" className="  w-[200px]  invert" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
