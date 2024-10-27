import React, { useState } from 'react';
import Pen from '../../assets/pen.svg';
import Notes from '../../assets/noteslogo.svg';
import '../main/Main.css';
import SignUp from '../signup/SignUp';
import Login from '../login/Login';

function Main() {
  const [showForm, setShowForm] = useState('');

  const handleSignUpClick = () => {
    setShowForm('signup');
  };

  const handleLoginClick = () => {
    setShowForm('login');
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <h1 className="xl:mt-3 mt-2 mx-5 xl:text-3xl text-xl flex font-semibold">
          <img src={Pen} alt="" className='xl:w-6 w-4 pb-5 me-1' />
          Smart <span className='text-[#0D7C66] ps-1'>Notes</span>
        </h1>
        <ul className="flex p-3 xl:pt-4 font-semibold">
          <li className="px-3">
            <button
              onClick={handleSignUpClick}
              className="text-white xl:text-2xl text-lg border rounded-lg xl:px-8 px-5 xl:py-1.5 py-0.5 bg-[#0D7C66]"
            >
              Signup
            </button>
          </li>
          <li>
            <button
              onClick={handleLoginClick}
              className="text-white xl:text-2xl text-lg border rounded-lg xl:px-8 px-5 xl:py-1.5 py-0.5 bg-[#0D7C66]"
            >
              Login
            </button>
          </li>
        </ul>
      </div>

      
        <div className='flex overflow-hidden pt-'>
          <div className='w-4/6 pt-32 ps-20'>
            <p className='main font-semibold'>
              Smart <span className='text-[#0D7C66] ps-1 main'>Notes</span>
            </p>
            <p className='xl:text-xl text-md font-semibold'>
              SmartNotes Is A Streamlined Note-Taking App With Essential Features Like User
              Authentication And Note Categorization. Perfect For Users Seeking A Simple, Efficient Way
              To Manage Their Notes.
            </p>
            <div className='flex mt-10 font-semibold'>
              <p className='border rounded-full bg-[#41b3a2] xl:px-16 px-8 py-2 pb-1 xl:text-3xl text-xl text-white ms-2'>Note</p>
              <p className='border rounded-full bg-[#41b3a2] xl:px-16 px-8 py-2 pb-1 xl:text-3xl text-xl text-white ms-2'>Organise</p>
              <p className='border rounded-full bg-[#41b3a2] xl:px-16 px-8 py-2 xl:text-3xl text-xl text-white ms-2'>Secure</p>
            </div>
          </div>
          <div className='mt-12'>
            {!showForm && <img src={Notes} alt="" className='w-11/12' />}
              {showForm === 'signup' && <SignUp setShowForm = {setShowForm} />}
            {showForm === 'login' && <Login />}
          
        </div>
      </div>
    </div>
  );
}

export default Main;
