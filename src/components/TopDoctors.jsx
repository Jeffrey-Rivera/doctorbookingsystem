import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-600 md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Here are the lists of our experienced and well-trained doctors</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div 
                        onClick={() => { item.available && navigate(`/appointment/${item._id}`); item.available && scrollTo(0, 0); }} 
                        className={`border border-pink-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ${item.available ? '' : 'bg-gray-100'}`} 
                        key={index}
                    >
                        <img className='bg-pink-50' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'} `}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                            </div>
                            <p className={`text-lg font-medium ${item.available ? 'text-gray-700' : 'text-gray-400'}`}>{item.name}</p>
                            <p className={`text-sm ${item.available ? 'text-gray-500' : 'text-gray-400'}`}>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0); }} className='bg-pink-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
        </div>
    );
};

export default TopDoctors;
