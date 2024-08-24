import React from 'react'

function SignUp() {
  return (
    <div className='w-4/12 ms-40 mb-20'>
      <div className=' mx-10'>
        <p className='text-center py-2 bg-[#41b3a2] xl:text-3xl text-white font-semibold rounded-t-md'>SignUp</p>
      <form className='bg-[#f5f5f5] px-4  pb-10 rounded-b-md'>
        <div className='py-5' >
          <label htmlFor="username" className='block text-xl font-bold mt-5'>Name:</label>
          <input type="text" className='w-full  py-4 border border-black rounded-md bg-[#d7eae8] mt-3 ' />
        </div>
        <div className='py-5'>
          <label htmlFor="email" className='block text-xl font-bold'>Email:</label>
          <input type="email" className='w-full py-4 border border-black rounded-md bg-[#d7eae8] mt-3 ' />
        </div>
        <div className='py-5'>
          <label htmlFor="password" className='block font-bold text-xl'>Password:</label>
          <input type="password" className='w-full py-4 border border-black rounded-md bg-[#d7eae8] mt-3' />
        </div>
        <div className='py-5'>
          <label htmlFor="notespassword" className='block font-bold text-xl'>Set Password For Notes:</label>
          <input type="text" className='w-full  py-4 border border-black rounded-md bg-[#d7eae8] mt-3' />
        </div>
        <div>
          <button className='px-5 py-2 xl:text-2xl mt-8  bg-[#d7eae8] border border-black rounded-lg ms-32 font-bold'>Confirm</button>
        </div>

      </form>
    </div>
    </div>
  )
}

export default SignUp