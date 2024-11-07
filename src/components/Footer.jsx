import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* ---Left side--- */}
                <div>
                    <img className='mb-5 w-24' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-500 leading-6'>Welcome to our clinic...</p>
                </div>

                {/* ---Center side--- */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-500'>
                        <li><a href="/" className='hover:text-black cursor-pointer'>Home</a></li>
                        <li><a href="/careers" className='hover:text-black cursor-pointer'>Careers</a></li>
                        <li><a href="/about" className='hover:text-black cursor-pointer'>About us</a></li>
                        <li><a href="/contact" className='hover:text-black cursor-pointer'>Contact us</a></li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                {/* ---Right side--- */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-500'>
                        <li>+1 587 1234567</li>
                        <li>doctorbooking@gmail.com</li>
                    </ul>
                </div>
            </div>

            {/* ---Right side--- */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ DoctorBooking - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer