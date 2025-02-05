import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import Pen from '../assets/pen.svg'

function ProfileLayout() {
  return (
    <div className='fullProfile ms-3 mb-0 '>
     <h1 className="xl:mt-3 mt-2  xl:text-3xl text-xl flex font-semibold">
          <img src={Pen} alt="" className='xl:w-6 w-4 pb- me-1' />
          Smart <span className='text-[#0D7C66] ps-1'>Notes</span>
        </h1>
      <div className='flex'>
        <div className='w-1/5'>
          <Sidebar />
        </div>
        <div className='w-4/5 p-4 m-0'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
