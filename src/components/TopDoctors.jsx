import React from 'react'
import { doctors } from '../assets/assets'

const TopDoctors = () => {
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-800 md:mx-10'>
        <h1 className='text-3xl font-medium'>Top Doctors</h1>
        <p className='sm:w-1/3 text-center text-sm'>Here are the lists of our experienced and well-trained doctors</p>
        <div className='w-full grid grid-cols-auto gap-4 pt-5 gapy-y-6 px-3 sm:px-0'>
            {doctors.slice(0,10).map((item,index)=>(
                <div className='border border-pink-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                    <img className='bg-pink-50' src={item.image} alt="" />
                    <div className='p-4'>
                        <div className='flex items-center gap-2 text-sm text-center text-green-400'>
                            <p className='w-2 h2 bg-green-500 rounded-full'></p><p>Available</p>
                            </div>
                            <p>{item.name}</p>
                            <p>{item.speciality}</p>
                            </div>
                        </div>
            ))}
        </div>
        <button>more</button>
    </div>
  )
}

export default TopDoctors