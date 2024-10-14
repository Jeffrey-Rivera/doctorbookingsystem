import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-800 font semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>

        <img className='w-full md:max-w-[369px]' src={assets.contact_image} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>Office</p>
          <p className='text-gray-500'>69 Auburn Meadows View <br /> SouthEast, Calgary, Alberta, Canada T3M 2C8</p>
          <p className='text-gray-500'>Tel: (587) 1234567 <br /> Email: doctorbooking@gmail.com </p>
          <p className='font-semibold text-lg text-gray-600'>Careers at Doctor Booking</p>
          <p className='text-gray-500'>Be one of our elite and TOP DOCTORS...</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-pink-300 hover:text-white transition-all duration-500'>Join Us</button>
        </div>


      </div>

    </div>
  )
}

export default Contact