import React from 'react';

const Navbar = ( ) => {
  return (
    <div>
      <nav className='p-3 border-solid border-gray-600 bg-black'>
        <div className='flex items-center justify-between'>

          <div>
            <h1 className='text-xl font-bold text-white'>
              workmate
            </h1>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
