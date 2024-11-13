import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
    const [showPrivacyMessage, setShowPrivacyMessage] = useState(false);

    const handleCloseMessage = () => {
        setShowPrivacyMessage(false);
    };

    const handleShowMessage = () => {
        setShowPrivacyMessage(true);
    };

    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* ---Left side with logo and paragraph--- */}
                <div className='flex items-start gap-4'>
                    <img className='w-24' src={assets.logo} alt="Doctor Booking Logo" />
                    <div>
                        <p className='text-gray-500 leading-6 text-justify'>
                            Welcome to <b>Doctor Booking</b> – the innovative platform that connects patients with healthcare professionals through modern technology, making it easier to schedule appointments anytime, anywhere.
                        </p>
                        <p className='text-gray-500 leading-6 text-justify mt-4'>
                            We aim to streamline healthcare services by providing a seamless experience for users, eliminating long wait times, and enabling quick access to trusted doctors and specialists.
                        </p>
                    </div>
                </div>

                {/* ---Center side--- */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-500'>
                        <li><a href="/" className='hover:text-black cursor-pointer'>Home</a></li>
                        <li><a href="/careers" className='hover:text-black cursor-pointer'>Careers</a></li>
                        <li><a href="/about" className='hover:text-black cursor-pointer'>About us</a></li>
                        <li><a href="/contact" className='hover:text-black cursor-pointer'>Contact us</a></li>
                        <li>
                            <button
                                className='text-gray-500 hover:text-black cursor-pointer'
                                onClick={handleShowMessage}
                            >
                                Privacy policy
                            </button>
                        </li>
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

            {/* Privacy Policy Message */}
            {showPrivacyMessage && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full md:w-[800px] lg:w-[900px] h-[40vh] relative">
                        <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                        <p className="text-gray-700 text-justify">
                            At Doctor Booking, we take your privacy seriously. Your personal information is used only to provide you with the best healthcare experience. We do not share your data with third parties without your consent. For more details, please refer to our full privacy policy.
                        </p>
                        <p className="text-gray-700 text-justify mt-4">
                            Our platform adheres to strict data protection guidelines, ensuring your personal and medical data is safeguarded. We are committed to maintaining your trust by providing transparent practices about how your data is collected, stored, and used. By using our platform, you agree to the terms outlined in this policy.
                        </p>

                        {/* Close Button (Positioned at bottom-left) */}
                        <button
                            className="absolute bottom-4 right-8 text-white bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full text-sm"
                            onClick={handleCloseMessage}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ DoctorBooking - All Right Reserved.</p>
            </div>
        </div>
    );
}

export default Footer;
