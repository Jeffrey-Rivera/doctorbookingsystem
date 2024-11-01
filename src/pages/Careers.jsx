import React from 'react'
import { assets } from '../assets/assets'

const Careers = () => {
    return (
        <div>

            <div className='text-center text-2xl pt-10 text-gray-500'>
                <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
            </div>

            <div className='my-6 flex flex-col md:flex-row gap 12'>
                <img className='w-full md:max-w-[369px]' src={assets.about_image} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-500'>
                    <p>Welcome to Doctor Booking</p>
                    <p>Healthcare Technology</p>
                    <b className='text-gray-500'> Our Vision</b>
                    <p>Our vision...</p>
                </div>
            </div>

            <div className='text-center text-xl my-4'>
                <p>Why <span className='text-gray-500 font-semibold'>CHOOSE US</span></p>
            </div>

            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col fap-5 text-[15px] hover:bg-pink-200 hover:text-white transition-all duration-300 text-gray-500 cursor-pointer'>
                    <b>Experience</b>
                    <p>Lorem ipsum dolor sit, iste debitis. Tempora!</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col fap-5 text-[15px] hover:bg-pink-200 hover:text-white transition-all duration-300 text-gray-500 cursor-pointer'>
                    <b>Location</b>
                    <p>Lorem ipsum dolor sit, iste debitis. Tempora!</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col fap-5 text-[15px] hover:bg-pink-200 hover:text-white transition-all duration-300 text-gray-500 cursor-pointer'>
                    <b>Community</b>
                    <p>Lorem ipsum dolor sit, iste debitis. Tempora!</p>
                </div>
            </div>

        </div>
    )
}

export default Careers